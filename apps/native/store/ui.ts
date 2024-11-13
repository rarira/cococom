import { createWithEqualityFn as create } from 'zustand/traditional';

interface UIState {
  tabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>()(set => ({
  tabBarVisible: true,
  setTabBarVisible: visible => set({ tabBarVisible: visible }),
}));
