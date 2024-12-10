import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import ScreenContainerView from '@/components/custom/view/container/screen';
import Text from '@/components/core/text';
import { storage, STORAGE_KEYS, TODAYS_NOTIFICATION_DATA } from '@/libs/mmkv';

export default function NotiCenterScreen() {
  const [todaysNotifications, setTodaysNotifications] = useState<TODAYS_NOTIFICATION_DATA>();

  useFocusEffect(
    useCallback(() => {
      const todaysNotification = storage.getString(STORAGE_KEYS.TODAYS_NOTIFICATION);
      const parsedTodaysNotification = todaysNotification ? JSON.parse(todaysNotification) : null;
      setTodaysNotifications(parsedTodaysNotification);
    }, []),
  );

  console.log('todaysNotifications', todaysNotifications);

  return (
    <ScreenContainerView withBottomTabBar>
      <Text>Noti-center</Text>
    </ScreenContainerView>
  );
}
