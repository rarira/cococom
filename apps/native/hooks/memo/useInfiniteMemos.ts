// const queryFn = (itemId: number, userId: string) => () => supabase.fetchMemos(itemId, userId);

import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { MEMO_INFINITE_QUERY_PAGE_SIZE } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useInfiniteMemos(itemId: number) {
  const user = useUserStore(store => store.user);

  const { data, error, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: queryKeys.memos.byItem(itemId, user!.id),
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

  return { memos, error, isFetching, handleEndReached };
}