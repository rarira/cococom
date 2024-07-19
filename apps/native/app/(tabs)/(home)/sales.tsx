import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountList from '@/components/custom/list/discount';

export default function SalesScreen() {
  const { styles } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container(tabBarHeight)}>
      <DiscountList categorySector="디지털/가전" />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (tabBarHeight: number) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: tabBarHeight + theme.spacing.lg,
  }),
}));
