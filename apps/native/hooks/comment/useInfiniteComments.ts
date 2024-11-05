import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { INFINITE_COMMENT_PAGE_SIZE } from '@/constants';
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
      queryFn: ({ pageParam }) => {
        return supabase.comments.fetchComments({
          itemId,
          page: pageParam,
          pageSize: INFINITE_COMMENT_PAGE_SIZE,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < INFINITE_COMMENT_PAGE_SIZE) {
          return null;
        }
        return allPages.length;
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
