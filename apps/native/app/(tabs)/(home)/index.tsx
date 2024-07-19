import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useQuery } from '@tanstack/react-query';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountList from '@/components/custom/list/discount';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';

function fetchCurrentDiscountsByCategorySector() {
  const currentTimestamp = new Date().toISOString().split('T')[0];

  console.log({ currentTimestamp });
  return supabase.fetchCurrentDiscountsByCategorySector(currentTimestamp);
}

export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.discounts.currentListByCategorySector(),
    queryFn: () => fetchCurrentDiscountsByCategorySector(),
  });

  console.log('current data', { data, error });
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
