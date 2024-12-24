import { useEffect, useCallback } from 'react';
import * as Device from 'expo-device';

import { registerForPushNotificationsAsync } from '@/libs/notifications';
import { supabase } from '@/libs/supabase';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useUserStore } from '@/store/user';

export function useRequestNotificationPermission(ignore?: boolean) {
  const { reportToSentry } = useErrorHandler();
  const { user, setProfile } = useUserStore(state => ({
    user: state.user,
    setProfile: state.setProfile,
  }));

  const requestPermission = useCallback(async () => {
    if (!Device.isDevice) return;

    const result = await registerForPushNotificationsAsync();
    if (!user || !result) return;

    const profile = await supabase.profiles.updateProfile(
      { expo_push_token: result.token },
      user.id,
    );

    setProfile(profile[0]);
  }, [setProfile, user]);

  useEffect(() => {
    if (ignore) return;

    requestPermission().catch(reportToSentry);
  }, [ignore, requestPermission, reportToSentry]);

  return { requestPermission };
}
