import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { useStyles } from 'react-native-unistyles';

export function useTransparentHeader(options: Record<string, any>) {
  const { theme } = useStyles();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: 'transparent' },
      headerBlurEffect: 'systemUltraThinMaterial',
      headerTransparent: true,
      contentStyle: { paddingTop: headerHeight },
      headerTintColor: theme.colors.typography,
      headerTitleStyle: {
        paddingStart: 0,
        fontSize: (theme.fontSize.md + theme.fontSize.sm) / 2,
        fontWeight: 'bold',
      },
      ...options,
    });
  }, [
    navigation,
    theme.colors.modalBackground,
    theme.colors.typography,
    theme,
    headerHeight,
    options,
  ]);
}
