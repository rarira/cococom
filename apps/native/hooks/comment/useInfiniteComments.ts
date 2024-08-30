// const queryFn = (itemId: number, userId: string) => () => supabase.fetchMemos(itemId, userId);

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { COMMENT_INFINITE_QUERY_PAGE_SIZE } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';


export function useInfiniteComments(itemId: number) {
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore(store => store.user);

  const queryClient = useQueryClient();

  const queryKey = queryKeys.comments.byItem(itemId);

  const { data, error, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey,
      queryFn: ({ pageParam }) =>
        supabase.fetchComments({
          itemId,
          page: pageParam,
          pageSize: COMMENT_INFINITE_QUERY_PAGE_SIZE,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < COMMENT_INFINITE_QUERY_PAGE_SIZE) return undefined;
        return allPages.length + 1;
      },
    });

  const comments = useMemo(() => data?.pages.flatMap(page => page), [data]);

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
    comments,
    error,
    isLoading,
    handleEndReached,
    isFetchingNextPage,
    handleRefresh,
    refreshing,
  };
}
