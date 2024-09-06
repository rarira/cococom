import { useEffect } from 'react';

import useSession from '@/hooks/useSession';
import { getProfile } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useLoadUser() {
  const session = useSession();
  const { user, profile, setUser, setProfile, authProcessing } = useUserStore(state => ({
    user: state.user,
    setUser: state.setUser,
    profile: state.profile,
    setProfile: state.setProfile,
    authProcessing: state.authProcessing,
  }));

  useEffect(() => {
    if (authProcessing) return;
    if (session) {
      setUser(session.user);
      if (!profile) {
        (async () => {
          const profile = await getProfile(session.user.id);
          setProfile(profile);
        })();
      }
    }
  }, [authProcessing, profile, session, setProfile, setUser]);

  return user;
}
