import { useCallback } from 'react';

import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useSignOut() {
  const { setUser, setProfile } = useUserStore(state => ({
    setUser: state.setUser,
    setProfile: state.setProfile,
  }));

  const signOut = useCallback(async () => {
    await supabase.signOut();
    setUser(null);
    setProfile(null);
  }, [setProfile, setUser]);

  return signOut;
}
