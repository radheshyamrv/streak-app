import Task from "../models/Task.js";
import Module from "../models/Module.js";
import CheatDay from "../models/CheatDay.js";
import { toDateKey } from "../utils/date.js";
import { calculateCurrentStreak, calculateLongestStreak } from "../utils/streak.js";
import { canUseCheatDay, getTaskStats } from "../services/streakService.js";

async function ownedTask(userId, id) {
  return Task.findOne({ _id: id, user: userId }).populate("module", "name");
}

export async function listTasks(req, res) {
  const tasks = await Task.find({ user: req.user._id, active: true })
    .populate("module", "name")
    .sort({ createdAt: -1 });

  const today = toDateKey();
  const result = await Promise.all(tasks.map(async task => ({
    ...task.toObject(),
    stats: await getTaskStats(task, today)
  })));

  res.json(result);
}

export async function createTask(req, res) {
  const { name, description = "", moduleId, targetDays } = req.body;

  if (!name?.trim() || !moduleId || !Number.isInteger(Number(targetDays))) {
    return res.status(400).json({ message: "Name, module and integer targetDays are required." });
  }

  const module = await Module.findOne({ _id: moduleId, user: req.user._id, active: true });
  if (!module) return res.status(404).json({ message: "Module not found." });

  const task = await Task.create({
    user: req.user._id,
    module: module._id,
    name: name.trim(),
    description,
    targetDays: Number(targetDays)
  });

  await task.populate("module", "name");
  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const allowed = ["name", "description", "targetDays", "active", "module"];
  const update = {};
  for (const key of allowed) if (req.body[key] !== undefined) update[key] = req.body[key];

  if (update.module) {
    const module = await Module.findOne({ _id: update.module, user: req.user._id, active: true });
    if (!module) return res.status(404).json({ message: "Module not found." });
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: update },
    { new: true, runValidators: true }
  ).populate("module", "name");

  if (!task) return res.status(404).json({ message: "Task not found." });
  res.json(task);
}

export async function deleteTask(req, res) {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { active: false },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: "Task not found." });
  res.json({ message: "Task archived." });
}

export async function completeTask(req, res) {
  const task = await ownedTask(req.user._id, req.params.id);
  if (!task || !task.active) return res.status(404).json({ message: "Task not found." });

  const date = req.body.date || toDateKey();
  const existing = task.completions.find(c => c.date === date);

  if (existing) {
    if (existing.status === "completed") return res.status(409).json({ message: "Task is already completed for this date." });
    existing.status = "completed";
    existing.note = req.body.note || "";
  } else {
    task.completions.push({ date, status: "completed", note: req.body.note || "" });
  }

  task.longestStreak = Math.max(task.longestStreak || 0, calculateLongestStreak(task));
  await task.save();

  res.json({
    task,
    stats: await getTaskStats(task, date)
  });
}

export async function useCheatDay(req, res) {
  const task = await ownedTask(req.user._id, req.params.id);
  if (!task || !task.active) return res.status(404).json({ message: "Task not found." });

  const date = req.body.date || toDateKey();
  const eligibility = await canUseCheatDay(task, date);

  if (!eligibility.allowed) {
    return res.status(400).json({
      message: "No earned cheat day is available.",
      detail: eligibility
    });
  }

  if (task.completions.some(c => c.date === date)) {
    return res.status(409).json({ message: "This date already has a task status." });
  }

  const blockNumber = eligibility.used + 1;
  await CheatDay.create({ user: req.user._id, task: task._id, date, blockNumber });
  task.completions.push({ date, status: "cheat", note: "Earned cheat day" });
  task.longestStreak = Math.max(task.longestStreak || 0, calculateLongestStreak(task));
  await task.save();

  res.json({ message: "Cheat day applied.", task, stats: await getTaskStats(task, date) });
}
