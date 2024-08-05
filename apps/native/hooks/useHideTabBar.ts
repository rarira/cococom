import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useStyles } from 'react-native-unistyles';

import { useUIStore } from '@/store/ui';

export function useHideTabBar() {
  const navigation = useNavigation();
  const { theme } = useStyles();
  const { setTabBarVisible } = useUIStore();

  useEffect(() => {
    // navigation.getParent()?.setOptions({
    //   tabBarStyle: {
    //     display: 'none',
    //   },
    // });
    setTabBarVisible(false);
    return () => {
      setTabBarVisible(true);
      // navigation.getParent()?.setOptions({
      //   tabBarStyle: {
      //     display: 'flex',
      //     position: 'absolute',
      //     backgroundColor: theme.colors.background,
      //   },
      // });
    };
  }, [setTabBarVisible]);
}
