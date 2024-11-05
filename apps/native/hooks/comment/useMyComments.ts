import { InfiniteItemsToRender, JoinedMyComments } from '@cococom/supabase/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { INFINITE_COMMENT_PAGE_SIZE } from '@/constants';
import { queryKeys } from '@/libs/react-query/';
import { MyCommentSortOption } from '@/libs/sort/my-comment';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export type MyCommentToRender = InfiniteItemsToRender<JoinedMyComments>;

export function useMyComments(sortOption: MyCommentSortOption) {
  const user = useUserStore(store => store.user);

  const queryKey = queryKeys.comments.my(user!.id, sortOption);

  const { data, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey,
      queryFn: ({ pageParam }) =>
        supabase.comments.fetchMyComments({
          userId: user!.id,
          page: pageParam,
          pageSize: INFINITE_COMMENT_PAGE_SIZE,
          orderBy: sortOption.field,
          orderDirection: sortOption.orderDirection,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < INFINITE_COMMENT_PAGE_SIZE) return null;
        return allPages.length;
      },
      enabled: !!user,
    });

  const comments: MyCommentToRender = useMemo(
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
    comments,
    isLoading,
    handleEndReached,
    isFetchingNextPage,
    queryKey,
  };
}
