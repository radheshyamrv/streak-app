import Module from "../models/Module.js";
import Task from "../models/Task.js";
import { calculateCurrentStreak } from "../utils/streak.js";
import { toDateKey } from "../utils/date.js";

export async function listModules(req, res) {
  const modules = await Module.find({ user: req.user._id, active: true }).sort({ createdAt: 1 });
  const tasks = await Task.find({ user: req.user._id, active: true });
  const today = toDateKey();

  const result = modules.map(module => {
    const moduleTasks = tasks.filter(t => String(t.module) === String(module._id));
    const streaks = moduleTasks.map(t => calculateCurrentStreak(t, today));
    const avg = streaks.length ? Math.round(streaks.reduce((a,b) => a+b, 0) / streaks.length) : 0;

    return {
      ...module.toObject(),
      taskCount: moduleTasks.length,
      averageStreak: avg,
      totalTargetDays: moduleTasks.reduce((s,t) => s + t.targetDays, 0)
    };
  });

  res.json(result);
}

export async function createModule(req, res) {
  const { name, description = "" } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: "Module name is required." });

  try {
    const module = await Module.create({ user: req.user._id, name: name.trim(), description });
    res.status(201).json(module);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Module already exists." });
    throw e;
  }
}

export async function updateModule(req, res) {
  const module = await Module.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!module) return res.status(404).json({ message: "Module not found." });
  res.json(module);
}

export async function deleteModule(req, res) {
  const module = await Module.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { active: false },
    { new: true }
  );
  if (!module) return res.status(404).json({ message: "Module not found." });
  await Task.updateMany({ user: req.user._id, module: module._id }, { active: false });
  res.json({ message: "Module archived." });
}
