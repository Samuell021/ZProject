const DAY = 86400000;
export function tehranDay(value = new Date()) {
  const date = new Date(value);
  if (!Number.isFinite(+date)) return null;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export function validDay(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function shiftDay(value, count) {
  return new Date(Date.parse(value + "T12:00:00Z") + count * DAY)
    .toISOString()
    .slice(0, 10);
}
export function startOfWeek(value) {
  const day = validDay(value) ? value : tehranDay();
  const offset = (new Date(day + "T12:00:00Z").getUTCDay() + 1) % 7;
  return shiftDay(day, -offset);
}
export function weekDays(value) {
  const start = startOfWeek(value);
  return Array.from({ length: 7 }, (_, i) => shiftDay(start, i));
}

// Each task appears in exactly one operational group, using the office timezone.
export function taskBucket(task, now = new Date()) {
  if (["COMPLETED", "DONE", "CANCELLED"].includes(task.status)) return "other";
  if (new Date(task.due_at) < new Date(now)) return "overdue";
  if (!task.due_at) return "other";
  return tehranDay(task.due_at) === tehranDay(now) ? "today" : "other";
}
