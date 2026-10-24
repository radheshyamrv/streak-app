import Task from "../models/Task.js";
import Freeze from "../models/Freeze.js";
import { addDays, toDateKey } from "../utils/date.js";
import { validateFreezeEligibility, applyFreezeToTask } from "../services/streakService.js";

export async function listFreezes(req, res) {
  const freezes = await Freeze.find({ user: req.user._id }).sort({ startDate: -1 });
  res.json(freezes);
}

export async function createFreeze(req, res) {
  const startDate = req.body.startDate || toDateKey();
  const days = Number(req.body.days);
  const reason = req.body.reason?.trim();

  if (!reason) return res.status(400).json({ message: "A reason is required." });

  const eligibility = await validateFreezeEligibility(req.user._id, startDate, days);
  if (!eligibility.allowed) return res.status(400).json({ message: eligibility.reason });

  const endDate = addDays(startDate, days - 1);
  const freeze = await Freeze.create({
    user: req.user._id,
    startDate,
    endDate,
    days,
    reason
  });

  const tasks = await Task.find({ user: req.user._id, active: true });
  for (const task of tasks) await applyFreezeToTask(task, freeze);

  res.status(201).json({ freeze, message: "Freeze applied to all active tasks." });
}
