import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { queryKeys } from '@/libs/react-query';
import { AlltimeSortOption } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useAlltimeRankingQuery(sortOption: AlltimeSortOption, limit?: number) {
  const [refreshing, setRefreshing] = useState(false);

  const user = useUserStore(store => store.user);

  const queryKey = queryKeys.alltimeRankings(
    user?.id ?? null,
    sortOption.field,
    sortOption.orderBy,
    limit ?? 50,
  );

  const { data, isLoading, error, refetch } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: () => {
      return supabase.fetchAlltimeRankingItems({
        userId: user?.id,
        orderByColumn: sortOption.field,
        orderByDirection: sortOption.orderBy,
        limitCount: limit ?? 50,
      });
    },
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return { data, error, isLoading, queryKey, refreshing, handleRefresh };
}