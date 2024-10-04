import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export function getDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDateWithTimezone(date: string): Date {
  return dayjs(date).tz('Asia/Seoul').toDate();
}

export function getISOTimeStringWithTimezone(date: string): string {
  return dayjs(date).tz('Asia/Seoul').toISOString();
}

export function addDays(date: Date, days: number) {
  return dayjs(date).add(days, 'day');
}

export function minus1MS(date: Dayjs): string {
  return dayjs(date).subtract(1, 'ms').toISOString();
}
