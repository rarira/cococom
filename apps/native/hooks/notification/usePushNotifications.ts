import { useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { NOTIFICATION_IDENTIFIER, registerForPushNotificationsAsync } from '@/libs/notifications';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

import { useErrorHandler } from '../useErrorHandler';

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

        console.log('addNotificationReceivedListener', { OS: Platform.OS, notification });
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('open notificattion', { OS: Platform.OS, response });
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
