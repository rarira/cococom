import { useMemo } from 'react';
import { useMMKVObject } from 'react-native-mmkv';

import { TODAYS_NOTIFICATION_DATA, STORAGE_KEYS } from '@/libs/mmkv';
import { SimplifiedCurrentIsoTimeString } from '@/libs/date';

export function useTodaysNotifications() {
  const [todaysNotifications, setTodaysNotifications] = useMMKVObject<TODAYS_NOTIFICATION_DATA>(
    STORAGE_KEYS.TODAYS_NOTIFICATION,
  );

  const sectionedNotifications = useMemo(() => {
    if (!todaysNotifications) return [];
    const tempArray = Object.entries(todaysNotifications).reduce(
      (acc, [date, notifications]) => {
        if (typeof notifications === 'boolean') return acc;
        acc.push({ title: date, data: notifications });
        return acc;
      },
      [] as {
        title: SimplifiedCurrentIsoTimeString;
        data: TODAYS_NOTIFICATION_DATA[SimplifiedCurrentIsoTimeString];
      }[],
    );
    if (tempArray.length === 1) return tempArray;
    return tempArray.sort((a, b) => (a.title > b.title ? -1 : 1));
  }, [todaysNotifications]);

  return { sectionedNotifications, setTodaysNotifications };
}
