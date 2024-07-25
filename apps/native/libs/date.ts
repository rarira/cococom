import { format } from 'date-fns';

export function formatLongLocalizedDate(date: string) {
  return format(date, 'PPPP');
}
