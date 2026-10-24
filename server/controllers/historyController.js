import Task from "../models/Task.js";
import DailyChallenge from "../models/DailyChallenge.js";
import Freeze from "../models/Freeze.js";
import { toDateKey, addDays } from "../utils/date.js";

export async function history(req, res) {
  const today = toDateKey();
  const start = addDays(today, -29);

  const [tasks, challenges, freezes] = await Promise.all([
    Task.find({ user: req.user._id, active: true }).populate("module", "name"),
    DailyChallenge.find({ user: req.user._id, date: { $gte: start, $lte: today } }).populate("challenge"),
    Freeze.find({ user: req.user._id, endDate: { $gte: start } })
  ]);

  const days = [];
  for (let i = 0; i < 30; i++) {
    const date = addDays(start, i);
    const taskItems = [];

    for (const task of tasks) {
      const completion = task.completions.find(c => c.date === date);
      taskItems.push({
        taskId: task._id,
        taskName: task.name,
        module: task.module?.name,
        status: completion?.status || "missed"
      });
    }

    days.push({ date, tasks: taskItems });
  }

  res.json({ days, challenges, freezes });
}
