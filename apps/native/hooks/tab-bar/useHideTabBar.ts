import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { useUiStore } from '@/store/ui';

export function useHideTabBar() {
  const setTabBarVisible = useUiStore(state => state.setTabBarVisible);

  useFocusEffect(
    useCallback(() => {
      setTabBarVisible(false);
      return () => {
        setTabBarVisible(true);
      };
    }, [setTabBarVisible]),
  );
}
