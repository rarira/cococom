// const queryFn = (itemId: number, userId: string) => () => supabase.fetchMemos(itemId, userId);

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { MEMO_INFINITE_QUERY_PAGE_SIZE } from '@/constants';
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
        supabase.fetchMemos({
          itemId,
          userId: user!.id,
          page: pageParam,
          pageSize: MEMO_INFINITE_QUERY_PAGE_SIZE,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < MEMO_INFINITE_QUERY_PAGE_SIZE) return undefined;
        return allPages.length + 1;
      },
      enabled: !!user,
    });

  const memos = useMemo(() => data?.pages.flatMap(page => page), [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  useLayoutEffect(() => {
    if (refreshing && !isFetching) {
      setRefreshing(false);
    }
  }, [isFetching, refreshing]);

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
