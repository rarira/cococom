import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { DiscountListItemCardProps } from '@/components/custom/card/list-item/discount';
import { DiscountChannels, RANKING_PAGE_SIZE } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { DiscountSortOption } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

function fetchCurrentDiscounts({
  userId,
  channel,
  limit,
  sortOption,
}: {
  userId?: string;
  channel: DiscountChannels;
  limit: number;
  sortOption: DiscountSortOption;
}) {
  const currentTimestamp = new Date().toISOString().split('T')[0];

  return supabase.fetchCurrentDiscountedRankingWithWishlistCount({
    currentTimestamp,
    userId,
    channel,
    limit,
    sortField: sortOption.field,
    sortDirection: sortOption.orderBy,
  });
}

export type CurrentDiscounts = NonNullable<ReturnType<typeof fetchCurrentDiscounts>>;

export function useDiscountedRankingListQuery({
  sortOption,
  channel,
  limit = RANKING_PAGE_SIZE,
}: {
  sortOption: DiscountSortOption;
  channel: DiscountChannels;
  limit?: number;
}) {
  const [refreshing, setRefreshing] = useState(false);

  const user = useUserStore(store => store.user);

  const queryClient = useQueryClient();

  const queryKey = queryKeys.discounts.rankedList({
    channel,
    userId: user?.id,
    limit,
    sortField: sortOption.field,
    sortDirection: sortOption.orderBy,
  });

  const { data, error, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => {
      const isCached = queryClient.getQueryData(queryKey);

      if (!isCached) {
        return fetchCurrentDiscounts({ userId: user?.id, channel, sortOption, limit });
      }

      return isCached as DiscountListItemCardProps['discount'][];
    },
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey });
    await refetch();
    setRefreshing(false);
  }, [queryClient, queryKey, refetch]);

  return { data, error, isLoading, refreshing, handleRefresh };
}
