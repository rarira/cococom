import { useEffect } from 'react';

import useSession from '@/hooks/useSession';
import { getProfile } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useLoadUser() {
  const session = useSession();
  const { user, setUser, setProfile } = useUserStore(state => ({
    user: state.user,
    setUser: state.setUser,
    setProfile: state.setProfile,
  }));

  useEffect(() => {
    if (session) {
      (async () => {
        const profile = await getProfile(session.user.id);
        setProfile(profile);
      })();
      setUser(session.user);
    }
  }, [session, setProfile, setUser]);

  return user;
}
