import dayjs from 'dayjs';
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

export function addDays(date: Date, days: number): string {
  return dayjs(date).add(days, 'day').toISOString();
}
