import { useCallback } from 'react';
import { Alert } from 'react-native';

import { AuthErrorCode } from '@/libs/error';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

import { useErrorHandler } from '../useErrorHandler';

export function useSignOut() {
  const { user, setUser, setProfile } = useUserStore(state => ({
    user: state.user,
    setUser: state.setUser,
    setProfile: state.setProfile,
  }));

  const { reportToSentry } = useErrorHandler();

  const signOut = useCallback(async () => {
    try {
      await supabase.profiles.updateProfile({ expo_push_token: null }, user!.id);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      if (error.code !== AuthErrorCode.USER_NOT_FOUND) {
        reportToSentry(error);
        Alert.alert('로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요');
      }
    }
  }, [reportToSentry, setProfile, setUser, user]);

  return signOut;
}
