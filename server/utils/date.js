export function toDateKey(date = new Date()) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export function addDays(dateKey, amount) {
  const d = new Date(`${dateKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + amount);
  return d.toISOString().slice(0, 10);
}

export function diffDays(a, b) {
  const da = new Date(`${a}T00:00:00Z`);
  const db = new Date(`${b}T00:00:00Z`);
  return Math.round((db - da) / 86400000);
}
