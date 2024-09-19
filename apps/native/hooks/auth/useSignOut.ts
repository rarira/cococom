import { useCallback } from 'react';

import { AuthErrorCode } from '@/libs/error';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useSignOut() {
  const { setUser, setProfile } = useUserStore(state => ({
    setUser: state.setUser,
    setProfile: state.setProfile,
  }));

  const signOut = useCallback(async () => {
    try {
      await supabase.signOut();
    } catch (error: any) {
      if (error.code !== AuthErrorCode.USER_NOT_FOUND) {
        console.error('signOut error', error);
        throw error;
      }
    } finally {
      setUser(null);
      setProfile(null);
    }
  }, [setProfile, setUser]);

  return signOut;
}
