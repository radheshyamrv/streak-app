import { addDays, diffDays } from "./date.js";

export function statusForDate(task, dateKey) {
  const item = task.completions.find(c => c.date === dateKey);
  return item?.status || null;
}

export function calculateCurrentStreak(task, today) {
  let streak = 0;
  let cursor = today;

  while (true) {
    const status = statusForDate(task, cursor);
    if (status === "completed" || status === "cheat" || status === "freeze") {
      streak++;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

export function calculateLongestStreak(task) {
  const sorted = [...task.completions]
    .filter(c => ["completed", "cheat", "freeze"].includes(c.status))
    .sort((a, b) => a.date.localeCompare(b.date));

  let best = 0;
  let current = 0;
  let previous = null;

  for (const item of sorted) {
    if (!previous || diffDays(previous, item.date) === 1) current++;
    else current = 1;
    best = Math.max(best, current);
    previous = item.date;
  }
  return best;
}

export function hasContinuousDays(task, endDate, days) {
  for (let i = 1; i <= days; i++) {
    const date = addDays(endDate, -i);
    const status = statusForDate(task, date);
    if (!["completed", "cheat", "freeze"].includes(status)) return false;
  }
  return true;
}
