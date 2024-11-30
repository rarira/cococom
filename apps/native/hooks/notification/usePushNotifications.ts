import { useState, useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

import { registerForPushNotificationsAsync } from '@/libs/notifications';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

import { useErrorHandler } from '../useErrorHandler';

export function usePushNotifications() {
  const { user, profile, setProfile } = useUserStore(state => ({
    user: state.user,
    profile: state.profile,
    setProfile: state.setProfile,
  }));

  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined,
  );

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
          notification.request.trigger?.payload!.aps['content-available'] === 1
        )
          return;

        setNotification(notification);
        Alert.alert(notification.request.content.title!, notification.request.content.body!);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
    }

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [profile?.expo_push_token]);

  return { notification };
}
