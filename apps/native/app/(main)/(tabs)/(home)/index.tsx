import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CategorySectorList from '@/components/custom/list/category-sector';
import HistoryInfoBanner from '@/components/custom/view/history-banner';

export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  const { top } = useSafeAreaInsets();

  const [totalDiscounts, setTotalDiscounts] = useState<number>(0);

  return (
    <View style={styles.container(top, tabBarHeight)}>
      <HistoryInfoBanner totalDiscounts={totalDiscounts} />
      <CategorySectorList setTotalDiscounts={setTotalDiscounts} />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number, tabBarHeight: number) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: tabBarHeight + theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: topInset,
  }),
}));
