import { InfiniteItemsToRender, JoinedMyMemos } from '@cococom/supabase/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { INFINITE_MEMO_PAGE_SIZE } from '@/constants';
import { queryKeys } from '@/libs/react-query/';
import { MyMemoSortOption } from '@/libs/sort/my-memo';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export type MyMemoToRender = InfiniteItemsToRender<JoinedMyMemos>;

export function useMyMemos(sortOption: MyMemoSortOption) {
  const user = useUserStore(store => store.user);

  const queryKey = queryKeys.memos.my(user!.id, sortOption);

  const { data, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey,
      queryFn: ({ pageParam }) =>
        supabase.memos.fetchMyMemos({
          userId: user!.id,
          page: pageParam,
          pageSize: INFINITE_MEMO_PAGE_SIZE,
          orderBy: sortOption.field,
          orderDirection: sortOption.orderDirection,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.length < INFINITE_MEMO_PAGE_SIZE) return null;
        return lastPageParam + 1;
      },
      enabled: !!user,
    });

  const memos: MyMemoToRender = useMemo(
    () =>
      data?.pages.flatMap(
        (page, index) => page.map(item => ({ ...item, pageIndex: index })) ?? [],
      ) ?? [],
    [data?.pages],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  return {
    memos,
    isLoading,
    handleEndReached,
    isFetchingNextPage,
    queryKey,
  };
}
