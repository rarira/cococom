import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { useUIStore } from '@/store/ui';

export function useHideTabBar() {
  const setTabBarVisible = useUIStore(state => state.setTabBarVisible);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);
      return () => {
        setTabBarVisible(true);
      };
    }, [setTabBarVisible]),
  );
}
