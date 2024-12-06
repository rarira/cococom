import { MMKV } from 'react-native-mmkv';
import { Database } from '@cococom/supabase/types';

import { getSimplifiedCurrentIsoTimeString } from './date';

export type TODAYS_NOTIFICATION_DATA = {
  date: string;
  data: Database['public']['Functions']['get_wishlist_items_on_sale_start']['Returns'];
};

export const storage = new MMKV();

export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'SEARCH_HISTORY',
  COLOR_SCHEME: 'COLOR_SCHEME',
  DISCOUNT_CHANNELS: 'DISCOUNT_CHANNELS',
  USER_ID: 'USER_ID',
  TODAYS_NOTIFICATION: 'TODAYS_NOTIFICATION',
} as const;

export function updateTodaysNotificationStorage(data: TODAYS_NOTIFICATION_DATA['data']) {
  if (!data.length) return;

  const today = getSimplifiedCurrentIsoTimeString();
  const existingData = storage.getString(STORAGE_KEYS.TODAYS_NOTIFICATION);

  if (existingData) {
    const parsedData = JSON.parse(existingData) as TODAYS_NOTIFICATION_DATA;
    if (parsedData.date === today) {
      parsedData.data.push(...data);
      return;
    }
  }

  storage.set(STORAGE_KEYS.TODAYS_NOTIFICATION, JSON.stringify({ date: today, data }));
}
