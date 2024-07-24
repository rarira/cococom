import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useStyles } from 'react-native-unistyles';

export function useHideTabBar() {
  const navigation = useNavigation();
  const { theme } = useStyles();

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: theme.colors.background,
        },
      });
    };
  }, [navigation, theme.colors.background]);
}
