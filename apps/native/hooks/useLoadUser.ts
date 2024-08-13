import { useEffect } from 'react';

import useSession from '@/hooks/useSession';
import { useUserStore } from '@/store/user';

export function useLoadUser() {
  const session = useSession();
  const { user, setUser } = useUserStore(state => ({ user: state.user, setUser: state.setUser }));

  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session, setUser]);

  return user;
}
