import { Tables, User } from '@cococom/supabase/types';
import { createWithEqualityFn as create } from 'zustand/traditional';

interface UserState {
  user: User | null;
  profile: Tables<'profiles'> | null;
  callbackAfterSignIn: ((user: User) => void) | null;
  authProcessing: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Tables<'profiles'> | null) => void;
  setCallbackAfterSignIn: (callback: ((user: User) => void) | null) => void;
  setAuthProcessing: (authProcessing: boolean) => void;
}

export const useUserStore = create<UserState>()(set => ({
  user: null,
  profile: null,
  callbackAfterSignIn: null,
  authProcessing: false,
  setUser: user => {
    set({ user });
  },
  setProfile: profile => set({ profile }),
  setCallbackAfterSignIn: callbackAfterSignIn => set({ callbackAfterSignIn }),
  setAuthProcessing: authProcessing => set({ authProcessing }),
}));
