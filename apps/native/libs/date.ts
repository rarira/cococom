import { JoinedItems } from '@cococom/supabase/types';
import { format } from 'date-fns';

export type SimplifiedCurrentIsoTimeString = `${number}-${number}-${number}`;

export function formatDashedDate(date: string) {
  return format(date, 'yyyy-MM-dd');
}
export function formatLongLocalizedDate(date: string) {
  return format(date, 'PPPP');
}

export function formatLongLocalizedDateTime(date: string) {
  return format(date, 'PPpp');
}

export function formatXAxisDate(date: Date) {
  return format(date, 'yy-MM');
}

export function isItemOnSaleNow(item: JoinedItems) {
  if (!item.discounts?.length) return false;

  const { startDate, endDate } = item.discounts[0];

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return now >= start && now < end;
}

export function convertDateString(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

export function getSimplifiedCurrentIsoTimeString() {
  return new Date().toISOString().split('T')[0] as SimplifiedCurrentIsoTimeString;
}
