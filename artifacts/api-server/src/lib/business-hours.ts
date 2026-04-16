import type { SubscriptionTier } from "./subscription-config";
import { getTierConfig } from "./subscription-config";

const BH_START_HOUR = 9;
const BH_END_HOUR = 17;
const BH_MINUTES_PER_DAY = (BH_END_HOUR - BH_START_HOUR) * 60;
const ET_TZ = "America/New_York";

function toET(date: Date): Date {
  const str = date.toLocaleString("en-US", { timeZone: ET_TZ });
  return new Date(str);
}

function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

export function isBusinessHours(date: Date = new Date()): boolean {
  const et = toET(date);
  if (!isWeekday(et)) return false;
  const hours = et.getHours();
  const minutes = et.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes >= BH_START_HOUR * 60 && totalMinutes < BH_END_HOUR * 60;
}

export function calculateSlaDeadline(submittedAt: Date, slaMinutes: number, isCritical: boolean): Date {
  if (isCritical) {
    return new Date(submittedAt.getTime() + slaMinutes * 60 * 1000);
  }

  let remaining = slaMinutes;
  const cursor = new Date(submittedAt.getTime());
  const et = toET(cursor);

  if (!isWeekday(et) || et.getHours() * 60 + et.getMinutes() >= BH_END_HOUR * 60) {
    advanceToNextBusinessStart(cursor);
  } else if (et.getHours() * 60 + et.getMinutes() < BH_START_HOUR * 60) {
    setToBusinessStart(cursor);
  }

  while (remaining > 0) {
    const cursorET = toET(cursor);

    if (!isWeekday(cursorET)) {
      advanceToNextBusinessStart(cursor);
      continue;
    }

    const currentMinute = cursorET.getHours() * 60 + cursorET.getMinutes();
    const endMinute = BH_END_HOUR * 60;
    const availableToday = endMinute - currentMinute;

    if (remaining <= availableToday) {
      cursor.setTime(cursor.getTime() + remaining * 60 * 1000);
      remaining = 0;
    } else {
      remaining -= availableToday;
      cursor.setTime(cursor.getTime() + (availableToday + 1) * 60 * 1000);
      advanceToNextBusinessStart(cursor);
    }
  }

  return cursor;
}

function advanceToNextBusinessStart(cursor: Date): void {
  const et = toET(cursor);
  let daysToAdd = 1;
  const day = et.getDay();

  if (day === 5) daysToAdd = 3;
  else if (day === 6) daysToAdd = 2;

  cursor.setTime(cursor.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  setToBusinessStart(cursor);
}

function setToBusinessStart(cursor: Date): void {
  const et = toET(cursor);
  const currentMinute = et.getHours() * 60 + et.getMinutes();
  const targetMinute = BH_START_HOUR * 60;
  const diff = targetMinute - currentMinute;
  cursor.setTime(cursor.getTime() + diff * 60 * 1000);
}

export function getSlaMinutesForTier(tier: SubscriptionTier): number {
  return getTierConfig(tier).slaMinutes;
}

export function getTimeRemainingMinutes(slaDeadline: Date, now: Date = new Date()): number {
  return Math.floor((slaDeadline.getTime() - now.getTime()) / (60 * 1000));
}

export type SlaStatus = "green" | "yellow" | "red" | "breached";

export function getSlaStatus(slaDeadline: Date, now: Date = new Date()): SlaStatus {
  const remaining = getTimeRemainingMinutes(slaDeadline, now);
  if (remaining <= 0) return "breached";
  if (remaining < 10) return "red";
  if (remaining < 30) return "yellow";
  return "green";
}

export function isAfterHours(date: Date = new Date()): boolean {
  return !isBusinessHours(date);
}
