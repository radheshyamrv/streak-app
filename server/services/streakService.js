import Task from "../models/Task.js";
import Freeze from "../models/Freeze.js";
import CheatDay from "../models/CheatDay.js";
import { addDays } from "../utils/date.js";
import { calculateCurrentStreak, calculateLongestStreak, hasContinuousDays } from "../utils/streak.js";

export async function getTaskStats(task, today) {
  const currentStreak = calculateCurrentStreak(task, today);
  const longestStreak = Math.max(task.longestStreak || 0, calculateLongestStreak(task));

  if (longestStreak !== task.longestStreak) {
    task.longestStreak = longestStreak;
    await task.save();
  }

  const completedCount = task.completions.filter(c => c.status === "completed").length;
  const cheatCount = task.completions.filter(c => c.status === "cheat").length;
  const freezeCount = task.completions.filter(c => c.status === "freeze").length;

  return {
    currentStreak,
    longestStreak,
    completedCount,
    cheatCount,
    freezeCount,
    targetDays: task.targetDays,
    targetProgress: Math.min(100, Math.round((currentStreak / task.targetDays) * 100))
  };
}

export async function canUseCheatDay(task, today) {
  // One earned cheat day for each completed 7-day block.
  const qualifying = task.completions.filter(c =>
    ["completed", "cheat", "freeze"].includes(c.status) && c.date < today
  ).length;

  const earnedBlocks = Math.floor(qualifying / 7);
  const used = await CheatDay.countDocuments({ task: task._id });

  return { allowed: earnedBlocks > used, earnedBlocks, used };
}

export async function applyFreezeToTask(task, freeze) {
  for (let i = 0; i < freeze.days; i++) {
    const date = addDays(freeze.startDate, i);
    const existing = task.completions.find(c => c.date === date);
    if (!existing) task.completions.push({ date, status: "freeze", note: freeze.reason });
  }
  task.longestStreak = Math.max(task.longestStreak || 0, calculateLongestStreak(task));
  await task.save();
}

export async function validateFreezeEligibility(userId, startDate, days) {
  if (days < 2 || days > 3) {
    return { allowed: false, reason: "Freeze must be 2 or 3 days." };
  }

  const previousFreeze = await Freeze.findOne({
    user: userId,
    startDate: { $gte: addDays(startDate, -30), $lt: startDate }
  });

  if (previousFreeze) {
    return { allowed: false, reason: "Only one freeze period is allowed in a rolling 30-day period." };
  }

  const tasks = await Task.find({ user: userId, active: true });
  if (!tasks.length) return { allowed: false, reason: "Create at least one active task first." };

  // Eligibility is based on every active task having 10 qualifying days immediately before start.
  for (const task of tasks) {
    if (!hasContinuousDays(task, startDate, 10)) {
      return {
        allowed: false,
        reason: `The task "${task.name}" does not have 10 continuous qualifying days before the freeze.`
      };
    }
  }

  return { allowed: true };
}
