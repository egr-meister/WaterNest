// In-app reminder logic only. These reminders are shown as gentle cards while
// the app is open. They NEVER use system notifications, background tasks,
// alarms or any permissions. Everything below is pure computation.

import { currentHour } from "./dateUtils";
import { progressRatio, safeAmount } from "./waterUtils";

// Returns a single gentle reminder object { id, text } or null.
// Based purely on today's progress and the current hour.
export function getActiveReminder(totalMl, goalMl, reminderSettings) {
  const settings = reminderSettings || {};
  if (settings.enabled === false) return null;

  const hour = currentHour();
  const total = safeAmount(totalMl);
  const ratio = progressRatio(total, goalMl);

  // Morning window: empty journal after 11:00.
  if (
    settings.morningEnabled !== false &&
    hour >= 11 &&
    hour < 16 &&
    total <= 0
  ) {
    return {
      id: "reminder-morning",
      text: "Your water journal is still empty today.",
    };
  }

  // Afternoon window: below 50% after 16:00.
  if (
    settings.afternoonEnabled !== false &&
    hour >= 16 &&
    hour < 20 &&
    ratio < 0.5
  ) {
    return {
      id: "reminder-afternoon",
      text: "You can add any drinks you remember.",
    };
  }

  // Evening window: goal not reached after 20:00.
  if (settings.eveningEnabled !== false && hour >= 20 && ratio < 1) {
    return {
      id: "reminder-evening",
      text: "Add any glasses you missed today.",
    };
  }

  return null;
}
