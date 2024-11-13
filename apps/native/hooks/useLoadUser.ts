import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import useSession from '@/hooks/useSession';
import { getProfile } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useLoadUser() {
  const session = useSession();
  const { user, profile, setUser, setProfile, authProcessing } = useUserStore(
    useShallow(state => ({
      user: state.user,
      setUser: state.setUser,
      profile: state.profile,
      setProfile: state.setProfile,
      authProcessing: state.authProcessing,
    })),
  );

  useEffect(() => {
    if (authProcessing) return;
    if (session) {
      setUser(session.user);
      if (!profile) {
        (async () => {
          try {
            const profile = await getProfile(session.user.id);
            setProfile(profile);
          } catch (error) {
            console.error('getProfile error', error);
          }
        })();
      }
    }
  }, [authProcessing, profile, session, setProfile, setUser]);

  return user;
}
