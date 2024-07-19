import { CategorySectors } from '@cococom/supabase/libs';
import { PortalHost } from '@gorhom/portal';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ListItemCard from '@/components/custom/card/list-item';
import { PortalHostNames } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

interface DiscountListProps {
  categorySector: CategorySectors;
}

function fetchCurrentDiscounts(userId?: string, categorySector?: CategorySectors) {
  const currentTimestamp = new Date().toISOString().split('T')[0];

  return supabase.fetchCurrentDiscountsWithWishlistCount(currentTimestamp, userId, categorySector);
}

export type CurrentDiscounts = NonNullable<ReturnType<typeof fetchCurrentDiscounts>>;

const NumberOfColumns = 1;

export default function DiscountList({ categorySector }: DiscountListProps) {
  const { styles } = useStyles(stylesheet);

  const { user } = useUserStore();

  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.discounts.currentList(user?.id, categorySector),
    queryFn: () => fetchCurrentDiscounts(user?.id, categorySector),
  });

  const renderItem = useCallback(
    ({ item }: { item: NonNullable<typeof data>[number]; index: number }) => {
      return <ListItemCard discount={item} numColumns={NumberOfColumns} key={item.id} />;
    },
    [],
  );

  if (error || !data || isLoading) return null;

  return (
    <>
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={600}
        keyExtractor={item => item.id.toString()}
        numColumns={NumberOfColumns}
        ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
        contentContainerStyle={styles.flashListContainer(NumberOfColumns > 1)}
      />
      <PortalHost name={PortalHostNames.HOME} />
    </>
  );
}

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: (isMultiColumn: boolean) => ({
    padding: isMultiColumn ? theme.spacing.xl : theme.spacing.lg,
  }),
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
}));
