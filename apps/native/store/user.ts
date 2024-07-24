import { User } from '@cococom/supabase/types';
import { create } from 'zustand';

interface UserState {
  user: User | null;
  callbackAfterSignIn: ((user: User) => void) | null;
  setUser: (user: User | null) => void;
  setCallbackAfterSignIn: (callback: ((user: User) => void) | null) => void;
}

export const useUserStore = create<UserState>()(set => ({
  user: null,
  callbackAfterSignIn: null,
  setUser: user => set({ user }),
  setCallbackAfterSignIn: callbackAfterSignIn => set({ callbackAfterSignIn }),
}));
