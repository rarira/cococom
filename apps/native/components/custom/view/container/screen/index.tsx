import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { memo } from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface ScreenContainerViewProps extends ViewProps {
  withHeader?: boolean;
  withBottomTabBar?: boolean;
}

const ScreenContainerView = memo(function ScreenContainerView({
  withHeader,
  withBottomTabBar,
  style,
  ...restProps
}: ScreenContainerViewProps) {
  const { styles } = useStyles(stylesheet);
  const { top } = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View
      style={[styles.container(withHeader ? 0 : top, withBottomTabBar ? tabBarHeight : 0), style]}
      {...restProps}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number, tabBarHeight: number) => ({
    flex: 1,
    paddingHorizontal: theme.screenHorizontalPadding,
    backgroundColor: theme.colors.background,
    paddingTop: topInset + theme.spacing.xl,
    paddingBottom: tabBarHeight + theme.spacing.xl,
  }),
}));

export default ScreenContainerView;