import { JoinedItems } from '@cococom/supabase/types';
import { format } from 'date-fns';

export function formatDashedDate(date: string) {
  return format(date, 'yyyy-MM-dd');
}
export function formatLongLocalizedDate(date: string) {
  return format(date, 'PPPP');
}

export function formatLongLocalizedDateTime(date: string) {
  return format(date, 'PPpp');
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
