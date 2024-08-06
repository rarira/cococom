import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { useStyles } from 'react-native-unistyles';

export function useTransparentHeader(options: Record<string, any>, transparent?: boolean) {
  const { theme } = useStyles();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: `${theme.colors.modalBackground}${transparent ? '88' : ''}` },
      ...(transparent
        ? {
            headerBlurEffect: 'systemUltraThinMaterial',
            headerTransparent: true,
            contentStyle: { paddingTop: headerHeight },
          }
        : {}),
      headerTintColor: theme.colors.typography,
      ...options,
    });
  }, [
    navigation,
    theme.colors.modalBackground,
    theme.colors.typography,
    theme,
    headerHeight,
    options,
    transparent,
  ]);
}
