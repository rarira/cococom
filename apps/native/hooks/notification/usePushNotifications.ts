import { useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useShallow } from 'zustand/shallow';

import { NOTIFICATION_IDENTIFIER } from '@/libs/notifications';
import { useUserStore } from '@/store/user';
import { useWalkthroughStore } from '@/store/walkthrough';

import { useRequestNotificationPermission } from './useRequestNotificationPermission';

Notifications.setNotificationHandler({
  handleNotification: async notification => {
    //https://github.com/expo/expo/issues/31184
    const trigger = notification.request.trigger as Notifications.PushNotificationTrigger;
    if (trigger?.type === 'push') {
      const isDataOnly =
        trigger?.remoteMessage?.notification === null ||
        (trigger?.payload?.aps as any)['content-available'] === 1;

      if (isDataOnly) {
        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      }
    }
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

function redirect(notification: Notifications.Notification) {
  const url = notification.request.content.data?.url;

  if (url) {
    router.push(url);
  }
}

export function usePushNotifications() {
  const { profile } = useUserStore(state => ({
    profile: state.profile,
  }));

  const isInIntroScreen = useWalkthroughStore(useShallow(state => state.flags.intro));

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useRequestNotificationPermission(isInIntroScreen);

  useEffect(() => {
    if (profile?.expo_push_token) {
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        if (
          notification.request.content.body === null ||
          notification.request.trigger?.payload?.aps['content-available'] === 1 ||
          notification.request.identifier === NOTIFICATION_IDENTIFIER.LOCAL
        )
          return;
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        redirect(response.notification);
      });
    }

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [profile?.expo_push_token]);
}
