import type { SubscriptionTier } from "./subscription-config";
import { getTierConfig } from "./subscription-config";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

const BH_START_HOUR = 9;
const BH_END_HOUR = 17;
const ET_TZ = "America/New_York";

function getETComponents(date: Date): { year: number; month: number; day: number; hours: number; minutes: number; dayOfWeek: number } {
  const zoned = toZonedTime(date, ET_TZ);
  return {
    year: zoned.getFullYear(),
    month: zoned.getMonth(),
    day: zoned.getDate(),
    hours: zoned.getHours(),
    minutes: zoned.getMinutes(),
    dayOfWeek: zoned.getDay(),
  };
}

function etMinuteOfDay(date: Date): number {
  const { hours, minutes } = getETComponents(date);
  return hours * 60 + minutes;
}

function isWeekday(date: Date): boolean {
  const { dayOfWeek } = getETComponents(date);
  return dayOfWeek >= 1 && dayOfWeek <= 5;
}

function makeETDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  const wallClock = new Date(year, month, day, hour, minute, 0, 0);
  return fromZonedTime(wallClock, ET_TZ);
}

export function isBusinessHours(date: Date = new Date()): boolean {
  if (!isWeekday(date)) return false;
  const minute = etMinuteOfDay(date);
  return minute >= BH_START_HOUR * 60 && minute < BH_END_HOUR * 60;
}

export function calculateSlaDeadline(submittedAt: Date, slaMinutes: number, isCritical: boolean): Date {
  if (isCritical) {
    return new Date(submittedAt.getTime() + slaMinutes * 60 * 1000);
  }

  let remaining = slaMinutes;
  let current = new Date(submittedAt.getTime());

  if (!isWeekday(current) || etMinuteOfDay(current) >= BH_END_HOUR * 60) {
    current = advanceToNextBusinessStart(current);
  } else if (etMinuteOfDay(current) < BH_START_HOUR * 60) {
    current = setToBusinessStart(current);
  }

  while (remaining > 0) {
    if (!isWeekday(current)) {
      current = advanceToNextBusinessStart(current);
      continue;
    }

    const currentMinute = etMinuteOfDay(current);
    const availableToday = BH_END_HOUR * 60 - currentMinute;

    if (remaining <= availableToday) {
      return new Date(current.getTime() + remaining * 60 * 1000);
    }

    remaining -= availableToday;
    current = advanceToNextBusinessStart(
      new Date(current.getTime() + availableToday * 60 * 1000),
    );
  }

  return current;
}

function advanceToNextBusinessStart(date: Date): Date {
  const et = getETComponents(date);
  let daysToAdd = 1;

  if (et.dayOfWeek === 5) daysToAdd = 3;
  else if (et.dayOfWeek === 6) daysToAdd = 2;
  else if (et.dayOfWeek === 0) daysToAdd = 1;

  return makeETDate(et.year, et.month, et.day + daysToAdd, BH_START_HOUR, 0);
}

function setToBusinessStart(date: Date): Date {
  const et = getETComponents(date);
  return makeETDate(et.year, et.month, et.day, BH_START_HOUR, 0);
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
