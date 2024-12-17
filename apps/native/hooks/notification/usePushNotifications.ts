import { useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { router } from 'expo-router';

import { NOTIFICATION_IDENTIFIER, registerForPushNotificationsAsync } from '@/libs/notifications';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

import { useErrorHandler } from '../useErrorHandler';

function redirect(notification: Notifications.Notification) {
  const url = notification.request.content.data?.url;

  console.log('redirect', { url });
  if (url) {
    // const path = url.split('cococom.kr')[1];
    // console.log('path', { path });
    router.push(url);
  }
}

export function usePushNotifications() {
  const { user, profile, setProfile } = useUserStore(state => ({
    user: state.user,
    profile: state.profile,
    setProfile: state.setProfile,
  }));

  const { reportToSentry } = useErrorHandler();

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    (async () => {
      try {
        if (!Device.isDevice) return;

        const result = await registerForPushNotificationsAsync();
        if (!user || !result) return;

        const profile = await supabase.profiles.updateProfile(
          { expo_push_token: result.token },
          user.id,
        );

        setProfile(profile[0]);
      } catch (error) {
        reportToSentry(error as Error);
      }
    })();
  }, [reportToSentry, setProfile, user]);

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
        console.log('response', response);
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
