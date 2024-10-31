// const queryFn = (itemId: number, userId: string) => () => supabase.fetchMemos(itemId, userId);

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { INFINITE_COMMENT_PAGE_SIZE } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { MySortOption } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useMyComments(sortOption: MySortOption) {
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore(store => store.user);

  const queryClient = useQueryClient();

  const queryKey = queryKeys.comments.my(user!.id, sortOption);

  const { data, error, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey,
      queryFn: ({ pageParam }) =>
        supabase.fetchMyComments({
          userId: user!.id,
          page: pageParam,
          pageSize: INFINITE_COMMENT_PAGE_SIZE,
          orderBy: sortOption.field,
          orderDirection: sortOption.orderBy,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < INFINITE_COMMENT_PAGE_SIZE) return undefined;
        return allPages.length + 1;
      },
      enabled: !!user,
    });

  const comments = useMemo(() => data?.pages.flatMap(page => page), [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey });
    setRefreshing(false);
  }, [queryClient, queryKey]);

  return {
    comments,
    error,
    isLoading,
    handleEndReached,
    isFetchingNextPage,
    handleRefresh,
    refreshing,
  };
}
