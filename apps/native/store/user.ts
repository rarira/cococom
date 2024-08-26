import { Tables, User } from '@cococom/supabase/types';
import { create } from 'zustand';

interface UserState {
  user: User | null;
  profile: Tables<'profiles'> | null;
  callbackAfterSignIn: ((user: User) => void) | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: Tables<'profiles'> | null) => void;
  setCallbackAfterSignIn: (callback: ((user: User) => void) | null) => void;
}

export const useUserStore = create<UserState>()(set => ({
  user: null,
  profile: null,
  callbackAfterSignIn: null,
  setUser: user => set({ user }),
  setProfile: profile => set({ profile }),
  setCallbackAfterSignIn: callbackAfterSignIn => set({ callbackAfterSignIn }),
}));
