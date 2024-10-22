import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { DiscountChannels } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { WishlistSortOption } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';
import { InfiniteWishlistResultPages } from '@cococom/supabase/types';

type UseWishlistsParams = {
  channel: DiscountChannels;
  sortOption: WishlistSortOption;
  isOnSale?: boolean;
};

const PAGE_SIZE = 50;

export function useWishlists({ channel, sortOption, isOnSale }: UseWishlistsParams) {
  const user = useUserStore(store => store.user);

  const queryKey = queryKeys.wishlists.byUserId({
    userId: user!.id,
    channel,
    sortField: sortOption.field,
    sortDirection: sortOption.orderBy,
    isOnSale,
  });

  const { data, isFetching, isLoading, isFetchingNextPage, isSuccess, fetchNextPage, hasNextPage } =
    useInfiniteQuery<InfiniteWishlistResultPages>({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey,
      queryFn: ({ pageParam }) => {
        return supabase.fetchMyWishlistItems({
          userId: user!.id,
          channel,
          page: pageParam as number,
          pageSize: PAGE_SIZE,
          sortField: sortOption.field,
          sortDirection: sortOption.orderBy,
          isOnSale,
        });
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if ((lastPage.items?.length ?? 0) < PAGE_SIZE) return undefined;
        return allPages.length + 1;
      },
      // enabled: !!keywordToSearch,
    });

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  // const handleSortChange = useCallback(
  //   (sortOption: keyof typeof SEARCH_ITEM_SORT_OPTIONS) => {
  //     setSortOption(sortOption);
  //     callbackSortChange?.(sortOption);
  //   },
  //   [callbackSortChange],
  // );

  // // NOTE: DEBUG
  console.log('useWishlists', {
    sortOption,
    data,
    isFetching,
    isSuccess,
    pages: data?.pages,
    hasNextPage,
    pagaParams: data?.pageParams,
  });

  // const searchResult: SearchResultToRender = useMemo(
  //   () =>
  //     data?.pages.flatMap(
  //       (page, index) => page.items?.map(item => ({ ...item, pageIndex: index })) ?? [],
  //     ) ?? [],
  //   [data?.pages],
  // );

  return {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    handleEndReached,
    queryKey,
    totalResults: data?.pages[0].totalRecords ?? null,
  };
}
