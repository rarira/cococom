import { useState, useRef, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

import { registerForPushNotificationsAsync } from '@/libs/notifications';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function usePushNotifications() {
  const { user, setProfile } = useUserStore(state => ({
    user: state.user,
    setProfile: state.setProfile,
  }));

  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined,
  );
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const token = await registerForPushNotificationsAsync();

        const profile = await supabase.profiles.updateProfile({ expo_push_token: token }, user.id);

        setProfile(profile[0]);

        notificationListener.current = Notifications.addNotificationReceivedListener(
          notification => {
            setNotification(notification);
            Alert.alert(notification.request.content.title!, notification.request.content.body!);
          },
        );

        responseListener.current = Notifications.addNotificationResponseReceivedListener(
          response => {
            console.log(response);
          },
        );
      } catch (error) {
        console.error('usePushNotifications error', error);
      }
    })();

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [setProfile, user]);

  return { notification };
}
