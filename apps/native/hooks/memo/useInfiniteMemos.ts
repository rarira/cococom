import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { INFINITE_MEMO_PAGE_SIZE } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useInfiniteMemos(itemId: number) {
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore(store => store.user);

  const queryClient = useQueryClient();

  const queryKey = queryKeys.memos.byItem(itemId, user!.id);

  const { data, error, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey,
      queryFn: ({ pageParam }) =>
        supabase.memos.fetchMemos({
          itemId,
          userId: user!.id,
          page: pageParam,
          pageSize: INFINITE_MEMO_PAGE_SIZE,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < INFINITE_MEMO_PAGE_SIZE) return null;
        return allPages.length + 1;
      },
      enabled: !!user,
    });

  const memos = useMemo(() => data?.pages.flatMap(page => page), [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey });
    await queryClient.refetchQueries({ queryKey: queryKeys.items.byId(itemId, user?.id) });
    setRefreshing(false);
  }, [itemId, queryClient, queryKey, user?.id]);

  return {
    memos,
    error,
    isLoading,
    handleEndReached,
    isFetchingNextPage,
    handleRefresh,
    refreshing,
  };
}
