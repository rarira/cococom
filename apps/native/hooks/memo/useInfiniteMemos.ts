// const queryFn = (itemId: number, userId: string) => () => supabase.fetchMemos(itemId, userId);

import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

const PAGE_SIZE = 20;

export function useInfiniteMemos(itemId: number) {
  const user = useUserStore(store => store.user);

  const { data, error, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: queryKeys.memos.byItem(itemId, user!.id),
    queryFn: ({ pageParam }) =>
      supabase.fetchMemos({
        itemId,
        userId: user!.id,
        page: pageParam,
        pageSize: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
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
