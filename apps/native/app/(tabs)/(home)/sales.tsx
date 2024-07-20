import { CategorySectors } from '@cococom/supabase/libs';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountList from '@/components/custom/list/discount';
import { useHideTabBar } from '@/hooks/useHideTabBar';

export default function SalesScreen() {
  const { styles } = useStyles(stylesheet);
  // const navigation = useNavigation();

  const { categorySector } = useLocalSearchParams<{ categorySector: CategorySectors }>();

  console.log({ categorySector });
  const tabBarHeight = useBottomTabBarHeight();

  useHideTabBar();

  return (
    <View style={styles.container(tabBarHeight)}>
      <DiscountList categorySector={categorySector} />
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
