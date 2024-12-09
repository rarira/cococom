import { MMKV } from 'react-native-mmkv';
import { Database } from '@cococom/supabase/types';
import { addDays, isBefore } from 'date-fns';

import { getSimplifiedCurrentIsoTimeString, SimplifiedCurrentIsoTimeString } from './date';

export type TODAYS_NOTIFICATION_DATA = {
  unread: boolean;
  [
    key: SimplifiedCurrentIsoTimeString
  ]: Database['public']['Functions']['get_wishlist_items_on_sale_start']['Returns'];
};

export const storage = new MMKV();

const storageSize = storage.size;

console.log('storageSize', storageSize);

export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'SEARCH_HISTORY',
  COLOR_SCHEME: 'COLOR_SCHEME',
  DISCOUNT_CHANNELS: 'DISCOUNT_CHANNELS',
  USER_ID: 'USER_ID',
  TODAYS_NOTIFICATION: 'TODAYS_NOTIFICATION',
} as const;

export function updateTodaysNotificationStorage(
  data: TODAYS_NOTIFICATION_DATA[SimplifiedCurrentIsoTimeString],
) {
  if (!data.length) return;

  const today = getSimplifiedCurrentIsoTimeString();
  const existingData = storage.getString(STORAGE_KEYS.TODAYS_NOTIFICATION);

  if (existingData) {
    const parsedData = JSON.parse(existingData) as TODAYS_NOTIFICATION_DATA;
    const sortedParsedDataKeys = Object.keys(parsedData).sort();

    const dataKeysToRemove = sortedParsedDataKeys.filter(
      key => key !== 'unread' && isBefore(new Date(key), addDays(new Date(today), -6)),
    ) as SimplifiedCurrentIsoTimeString[];

    dataKeysToRemove.forEach(key => {
      delete parsedData[key];
    });

    if (parsedData[today]) {
      const itemIdsSet = new Set(parsedData[today].map(item => item.id));
      const dataToPush = data.filter(item => !itemIdsSet.has(item.id));
      parsedData[today].push(...dataToPush);
    } else {
      parsedData[today] = data;
    }

    parsedData.unread = true;
    storage.set(STORAGE_KEYS.TODAYS_NOTIFICATION, JSON.stringify(parsedData));
  }

  storage.set(STORAGE_KEYS.TODAYS_NOTIFICATION, JSON.stringify({ unread: true, [today]: data }));
}
