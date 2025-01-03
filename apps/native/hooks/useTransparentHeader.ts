import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';

import Util from '@/libs/util';

export function useTransparentHeader(options: Record<string, any>) {
  const { theme } = useStyles();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const currentTheme = UnistylesRuntime.themeName;

    navigation.setOptions({
      ...(Util.isPlatform('ios')
        ? {
            headerStyle: { backgroudColor: 'transparent' },
            headerBlurEffect:
              currentTheme === 'dark' ? 'systemMaterialDark' : 'systemMaterialLight',
            headerTransparent: true,
            contentStyle: { paddingTop: headerHeight },
          }
        : { headerStyle: { backgroundColor: theme.colors.modalBackground } }),
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
