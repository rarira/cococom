import { useState, useEffect, useMemo } from 'react';
import * as Notifications from 'expo-notifications';
import { User } from '@cococom/supabase/types';

export function useNotificationSetting(user: User | null) {
  const [permissionStatus, setPermissionStatus] =
    useState<Notifications.NotificationPermissionsStatus>();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const settings = await Notifications.getPermissionsAsync();
      setPermissionStatus(settings);
    })();
  }, [user]);

  const granted = useMemo(
    () =>
      permissionStatus?.status === 'granted' ||
      (!!permissionStatus?.ios?.status &&
        permissionStatus?.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL),
    [permissionStatus],
  );

  return { permissionStatus, setPermissionStatus, granted };
}
