import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { supabaseClient } from '@/libs/supabase';

export default function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      console.log('hook', { session });
      setSession(session);
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return session;
}
