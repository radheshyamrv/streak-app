import Task from "../models/Task.js";
import Module from "../models/Module.js";
import DailyChallenge from "../models/DailyChallenge.js";
import Freeze from "../models/Freeze.js";
import { toDateKey } from "../utils/date.js";
import { calculateCurrentStreak } from "../utils/streak.js";

export async function dashboard(req, res) {
  const today = toDateKey();

  const [tasks, modules, freezes, challenge] = await Promise.all([
    Task.find({ user: req.user._id, active: true }).populate("module", "name"),
    Module.find({ user: req.user._id, active: true }),
    Freeze.find({ user: req.user._id }),
    DailyChallenge.findOne({ user: req.user._id, date: today }).populate("challenge")
  ]);

  const taskStats = tasks.map(task => ({
    id: task._id,
    name: task.name,
    module: task.module?.name,
    streak: calculateCurrentStreak(task, today),
    completedToday: task.completions.some(c => c.date === today && ["completed", "cheat", "freeze"].includes(c.status)),
    targetDays: task.targetDays
  }));

  const completedToday = taskStats.filter(t => t.completedToday).length;
  const consistency = tasks.length ? Math.round((completedToday / tasks.length) * 100) : 0;

  const moduleStats = modules.map(module => {
    const moduleTasks = tasks.filter(t => String(t.module?._id) === String(module._id));
    const streak = moduleTasks.length
      ? Math.round(moduleTasks.reduce((s,t) => s + calculateCurrentStreak(t, today), 0) / moduleTasks.length)
      : 0;
    return { id: module._id, name: module.name, taskCount: moduleTasks.length, averageStreak: streak };
  }).sort((a,b) => b.averageStreak - a.averageStreak);

  res.json({
    today,
    user: { name: req.user.name },
    summary: {
      tasks: tasks.length,
      completedToday,
      consistency,
      activeModules: modules.length,
      freezePeriods: freezes.length
    },
    tasks: taskStats,
    modules: moduleStats,
    challenge: challenge || null
  });
}
