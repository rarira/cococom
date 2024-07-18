import { PortalHost } from '@gorhom/portal';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ListItemCard from '@/components/custom/card/list-item';
import { PortalHostNames } from '@/constants';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

function fetchCurrentDiscounts(currentTimestamp: string, userId?: string) {
  return supabase.fetchCurrentDiscountsWithWishlistCount(currentTimestamp, userId);
}

export type CurrentDiscounts = NonNullable<ReturnType<typeof fetchCurrentDiscounts>>;

const NumberOfColumns = 1;

const currentTimestamp = new Date().toISOString().split('T')[0];

export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);

  const { user } = useUserStore();

  const tabBarHeight = useBottomTabBarHeight();

  const { data, error, isLoading } = useQuery({
    queryKey: ['discounts', { userId: user?.id, currentTimestamp }],
    queryFn: () => fetchCurrentDiscounts(currentTimestamp, user?.id),
  });

  const renderItem = useCallback(
    ({ item, index }: { item: NonNullable<typeof data>[number]; index: number }) => {
      return <ListItemCard discount={item} numColumns={NumberOfColumns} />;
    },
    [],
  );

  if (error || !data || isLoading) return null;

  return (
    <>
      <View style={styles.container(tabBarHeight)}>
        <FlashList
          data={data}
          renderItem={renderItem}
          estimatedItemSize={600}
          keyExtractor={item => item.id.toString()}
          numColumns={NumberOfColumns}
          ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
          contentContainerStyle={styles.flashListContainer(NumberOfColumns > 1)}
        />
      </View>
      <PortalHost name={PortalHostNames.HOME} />
    </>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (tabBarHeight: number) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: tabBarHeight + theme.spacing.lg,
  }),
  flashListContainer: (isMultiColumn: boolean) => ({
    padding: isMultiColumn ? theme.spacing.xl : theme.spacing.lg,
  }),
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
}));
