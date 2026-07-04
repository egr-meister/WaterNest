// Pure helper functions for water totals, progress and statistics.
// All functions guard against empty arrays, missing fields and invalid numbers.

import { lastNDates, todayString } from "./dateUtils";

export function safeAmount(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

// All entries for a given date string.
export function entriesForDate(entries, date) {
  const list = Array.isArray(entries) ? entries : [];
  return list.filter((item) => item && item.date === date);
}

// Sum of amountMl for a given date.
export function totalForDate(entries, date) {
  return entriesForDate(entries, date).reduce(
    (sum, item) => sum + safeAmount(item?.amountMl),
    0
  );
}

// Progress ratio (0..1+) using real total; caller decides whether to cap.
export function progressRatio(totalMl, goalMl) {
  const goal = Math.max(1, Number(goalMl) || 1);
  const total = safeAmount(totalMl);
  return total / goal;
}

// Percent capped to 100 for display, rounded.
export function progressPercent(totalMl, goalMl) {
  const ratio = progressRatio(totalMl, goalMl);
  const capped = Math.max(0, Math.min(1, ratio));
  return Math.round(capped * 100);
}

// Real percent (uncapped) for text like "112% of goal" if needed.
export function realPercent(totalMl, goalMl) {
  return Math.round(progressRatio(totalMl, goalMl) * 100);
}

export function goalReached(totalMl, goalMl) {
  return safeAmount(totalMl) >= Math.max(1, Number(goalMl) || 1);
}

// Human-friendly formatting of ml with thousands separators.
export function formatMl(value) {
  const n = Math.round(safeAmount(value));
  return `${n.toLocaleString("en-US")} ml`;
}

export function formatMlPlain(value) {
  return Math.round(safeAmount(value)).toLocaleString("en-US");
}

// Remaining ml to reach goal (never negative).
export function remainingMl(totalMl, goalMl) {
  const goal = Math.max(1, Number(goalMl) || 1);
  return Math.max(0, goal - safeAmount(totalMl));
}

// A friendly one-line summary of today's progress.
export function progressSummary(totalMl, goalMl) {
  const total = safeAmount(totalMl);
  if (total <= 0) return "No water added today";
  if (goalReached(total, goalMl)) return "Goal reached";
  const remaining = remainingMl(total, goalMl);
  return `${formatMlPlain(remaining)} ml left`;
}

// Build a per-day summary map for a set of dates.
export function dailySummaries(entries, dates, goalMl) {
  return dates.map((date) => {
    const dayEntries = entriesForDate(entries, date);
    const total = dayEntries.reduce(
      (sum, item) => sum + safeAmount(item?.amountMl),
      0
    );
    return {
      date,
      totalMl: total,
      entryCount: dayEntries.length,
      goalReached: goalReached(total, goalMl),
    };
  });
}

// Distinct dates that have entries, newest first.
export function historyDates(entries) {
  const list = Array.isArray(entries) ? entries : [];
  const set = {};
  list.forEach((item) => {
    if (item && typeof item.date === "string" && item.date) {
      set[item.date] = true;
    }
  });
  return Object.keys(set).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
}

// Full statistics object used by the Statistics screen.
export function computeStatistics(entries, goalMl) {
  const list = Array.isArray(entries) ? entries : [];
  const today = todayString();
  const last7 = lastNDates(7);
  const last30 = lastNDates(30);

  const todayTotal = totalForDate(list, today);

  const sum7 = last7.reduce((s, d) => s + totalForDate(list, d), 0);
  const sum30 = last30.reduce((s, d) => s + totalForDate(list, d), 0);

  const goalDays7 = last7.reduce(
    (s, d) => s + (goalReached(totalForDate(list, d), goalMl) ? 1 : 0),
    0
  );
  const goalDays30 = last30.reduce(
    (s, d) => s + (goalReached(totalForDate(list, d), goalMl) ? 1 : 0),
    0
  );

  // Daily average across last 7 days (rounded).
  const avg7 = Math.round(sum7 / 7);

  // Best day (highest single-day total) across all history.
  const allDates = historyDates(list);
  let bestDay = null;
  let bestTotal = 0;
  allDates.forEach((d) => {
    const t = totalForDate(list, d);
    if (t > bestTotal) {
      bestTotal = t;
      bestDay = d;
    }
  });

  // Weekly mini-row data (last 7 days, oldest first).
  const week = last7.map((d) => ({
    date: d,
    totalMl: totalForDate(list, d),
    reached: goalReached(totalForDate(list, d), goalMl),
  }));
  const weekMax = week.reduce((m, w) => Math.max(m, w.totalMl), 0);

  return {
    todayTotal,
    total7: sum7,
    total30: sum30,
    average7: avg7,
    bestDay,
    bestTotal,
    goalDays7,
    goalDays30,
    totalEntries: list.length,
    entriesThisWeek: last7.reduce(
      (s, d) => s + entriesForDate(list, d).length,
      0
    ),
    week,
    weekMax,
  };
}
