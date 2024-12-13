import { useCallback, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { AppState } from 'react-native';
import * as Linking from 'expo-linking';

import { registerForPushNotificationsAsync } from '@/libs/notifications';
import { useUserStore } from '@/store/user';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { supabase } from '@/libs/supabase';

import { useNotificationSetting } from './useNotificationSetting';

export function useUpdateNotificationSetting() {
  const appState = useRef(AppState.currentState);
  const [optOutDialogVisible, setOptOutDialogVisible] = useState(false);

  const [dialogProps, setDialogProps] = useState<{
    title: string;
    body: string;
    onPressOk: () => void;
  } | null>(null);

  const { user, setProfile } = useUserStore(state => ({
    user: state.user,
    setProfile: state.setProfile,
  }));

  const { reportToSentry } = useErrorHandler();

  const { permissionStatus, setPermissionStatus, granted } = useNotificationSetting(user);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const settings = await Notifications.getPermissionsAsync();
        setPermissionStatus(settings);

        if (settings.status === 'granted') {
          const token = await Notifications.getExpoPushTokenAsync();
          if (token && user) {
            const profile = await supabase.profiles.updateProfile(
              { expo_push_token: token.data },
              user.id,
            );
            setProfile(profile[0]);
          }
        } else {
          if (user) {
            const profile = await supabase.profiles.updateProfile(
              { expo_push_token: null },
              user?.id,
            );
            setProfile(profile[0]);
          }
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [setPermissionStatus, setProfile, user]);

  const handleToggleNotification = useCallback(async () => {
    if (granted) {
      setDialogProps({
        title: '알림 수신 거부',
        body: '새로운 업데이트 알림을 받으실 수 없어요. 수신 거부하시려면 시스템 설정 메뉴에서 변경해 주세요. 설정 메뉴로 이동할까요?',
        onPressOk: async () => {
          await Linking.openSettings();
          setOptOutDialogVisible(false);
        },
      });
      setOptOutDialogVisible(true);
    } else {
      try {
        if (!!permissionStatus && !permissionStatus?.canAskAgain) {
          setDialogProps({
            title: '시스템 설정 변경 필요',
            body: '알림을 받으시려면 시스템 설정 메뉴에서 변경하셔야 합니다. 설정 메뉴로 이동할까요?',
            onPressOk: async () => {
              await Linking.openSettings();
              setOptOutDialogVisible(false);
            },
          });
          setOptOutDialogVisible(true);

          return;
        }
        const result = await registerForPushNotificationsAsync(permissionStatus);
        if (!user || !result) return;
        const profile = await supabase.profiles.updateProfile(
          { expo_push_token: result.token },
          user.id,
        );

        setPermissionStatus(result.finalStatus);
        setProfile(profile[0]);
      } catch (error) {
        reportToSentry(error as Error);
      }
    }
  }, [granted, permissionStatus, reportToSentry, setPermissionStatus, setProfile, user]);

  return {
    granted,
    optOutDialogVisible,
    setOptOutDialogVisible,
    dialogProps,
    handleToggleNotification,
  };
}
