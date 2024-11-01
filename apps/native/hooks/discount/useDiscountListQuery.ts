import { CategorySectors } from '@cococom/supabase/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { DiscountListItemCardProps } from '@/components/custom/card/list-item/discount';
import { DiscountChannels } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { DiscountSortOption, updateDiscountsByCategorySectorCache } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

function fetchCurrentDiscounts({
  userId,
  categorySector,
}: {
  userId?: string;
  categorySector?: CategorySectors;
}) {
  const currentTimestamp = new Date().toISOString().split('T')[0];

  return supabase.discounts.fetchCurrentDiscountsWithWishlistCount({
    currentTimestamp,
    userId,
    categorySector,
  });
}

export type CurrentDiscounts = NonNullable<ReturnType<typeof fetchCurrentDiscounts>>;

export function useDiscountListQuery({
  sortOption,
  channel,
  limit,
}: {
  sortOption: DiscountSortOption;
  channel: DiscountChannels;
  limit?: number;
}) {
  const [refreshing, setRefreshing] = useState(false);

  const user = useUserStore(store => store.user);

  const { categorySector } = useLocalSearchParams<{ categorySector: CategorySectors }>();

  const queryClient = useQueryClient();

  const queryKey = queryKeys.discounts.currentList(user?.id, categorySector);

  const { data, error, isLoading, isFetched, refetch } = useQuery({
    queryKey,
    queryFn: () => {
      const isCached = queryClient.getQueryData(queryKey);

      if (!isCached) {
        return fetchCurrentDiscounts({ userId: user?.id, categorySector: categorySector });
      }

      return isCached as DiscountListItemCardProps['discount'][];
    },
  });

  useLayoutEffect(() => {
    if (isFetched) {
      updateDiscountsByCategorySectorCache({
        userId: user?.id,
        sortOption,
        categorySector,
        queryClient,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySector, isFetched, queryClient, sortOption.text, user?.id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey });
    await refetch();
    setRefreshing(false);
  }, [queryClient, queryKey, refetch]);

  const dataToExport = useMemo(() => {
    return data
      ?.filter(item => {
        if (channel === DiscountChannels.ONLINE) return item.is_online;
        if (channel === DiscountChannels.OFFLINE) return !item.is_online;
        return true;
      })
      .slice(0, limit);
  }, [data, limit, channel]);

  return { data: dataToExport, error, isLoading, refreshing, handleRefresh };
}
