// Simple, stable date/time helpers. All dates are YYYY-MM-DD strings and all
// times are HH:mm strings. Everything guards against invalid input.

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad2(n) {
  const s = String(Math.abs(Math.floor(Number(n) || 0)));
  return s.length >= 2 ? s : "0" + s;
}

// Today as YYYY-MM-DD in local time.
export function todayString() {
  return dateToString(new Date());
}

export function dateToString(dateObj) {
  try {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return todayFallback();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  } catch (e) {
    return todayFallback();
  }
}

function todayFallback() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// Current time HH:mm in local time.
export function currentTimeString() {
  try {
    const d = new Date();
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  } catch (e) {
    return "00:00";
  }
}

// Current hour (0-23), used for reminder logic.
export function currentHour() {
  try {
    const h = new Date().getHours();
    return Number.isFinite(h) ? h : 12;
  } catch (e) {
    return 12;
  }
}

// Validate a YYYY-MM-DD string.
export function isValidDateString(value) {
  if (typeof value !== "string") return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return false;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

// Validate an HH:mm string.
export function isValidTimeString(value) {
  if (typeof value !== "string") return false;
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return false;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h >= 0 && h <= 23 && min >= 0 && min <= 59;
}

// Turn a YYYY-MM-DD string into a Date at local midnight (or null if invalid).
export function parseDateString(value) {
  if (!isValidDateString(value)) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

// Friendly display, e.g. "Mon, Jul 3, 2026".
export function formatDisplayDate(value) {
  const d = parseDateString(value);
  if (!d) return typeof value === "string" && value ? value : "Unknown date";
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// Short display, e.g. "Jul 3".
export function formatShortDate(value) {
  const d = parseDateString(value);
  if (!d) return typeof value === "string" && value ? value : "--";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

// Return an array of the last `count` date strings ending today (oldest first).
export function lastNDates(count) {
  const out = [];
  const n = Math.max(1, Math.floor(Number(count) || 1));
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base.getTime());
    d.setDate(d.getDate() - i);
    out.push(dateToString(d));
  }
  return out;
}

// Add `days` (can be negative) to a date string, returning a new string.
export function shiftDate(value, days) {
  const d = parseDateString(value) || new Date();
  d.setDate(d.getDate() + (Number(days) || 0));
  return dateToString(d);
}

export function relativeLabel(value) {
  const today = todayString();
  if (value === today) return "Today";
  if (value === shiftDate(today, -1)) return "Yesterday";
  return formatShortDate(value);
}
