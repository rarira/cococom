import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useLayoutEffect, useState } from 'react';

import { DiscountListItemCardProps } from '@/components/custom/card/list-item/discount';
import { DiscountChannels } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { DiscountSortOption, updateDiscountedRankedCache } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

function fetchCurrentDiscounts({
  userId,
  channel,
  limit = 50,
}: {
  userId?: string;
  channel: DiscountChannels;
  limit?: number;
}) {
  const currentTimestamp = new Date().toISOString().split('T')[0];

  return supabase.fetchCurrentDiscountedRankingWithWishlistCount({
    currentTimestamp,
    userId,
    channel,
    limit,
  });
}

export type CurrentDiscounts = NonNullable<ReturnType<typeof fetchCurrentDiscounts>>;

export function useDiscountedRankingListQuery({
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

  const queryClient = useQueryClient();

  const queryKey = queryKeys.discounts.rankedList(channel, user?.id, 50);

  const { data, error, isLoading, isFetched, refetch } = useQuery({
    queryKey,
    queryFn: () => {
      const isCached = queryClient.getQueryData(queryKey);

      if (!isCached) {
        return fetchCurrentDiscounts({ userId: user?.id, channel });
      }

      return isCached as DiscountListItemCardProps['discount'][];
    },
  });

  useLayoutEffect(() => {
    if (isFetched) {
      updateDiscountedRankedCache({
        channel,
        limit: 50,
        userId: user?.id,
        sortOption,
        queryClient,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched, queryClient, sortOption.text, user?.id, channel, limit]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey });
    await refetch();
    setRefreshing(false);
  }, [queryClient, queryKey, refetch]);

  return { data, error, isLoading, queryKey, refreshing, handleRefresh };
}
