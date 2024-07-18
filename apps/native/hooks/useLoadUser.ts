import { useEffect } from 'react';

import useSession from '@/hooks/useSession';
import { useUserStore } from '@/store/user';

export function useLoadUser() {
  const session = useSession();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session, setUser]);

  return user;
}
