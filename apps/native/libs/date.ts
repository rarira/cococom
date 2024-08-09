import { JoinedItems } from '@cococom/supabase/types';
import { format } from 'date-fns';

export function formatLongLocalizedDate(date: string) {
  return format(date, 'PPPP');
}

export function isItemOnSaleNow(item: JoinedItems) {
  if (!item.discounts?.length) return false;

  const { startDate, endDate } = item.discounts[item.discounts.length - 1];

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return now >= start && now < end;
}
