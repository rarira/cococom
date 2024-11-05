import {
  Database,
  InfiniteItemsToRender,
  InfiniteWishlistResultPages,
} from '@cococom/supabase/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { DiscountChannels, INFINITE_WISHLIST_PAGE_SIZE } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { WishlistSortOption } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export type WishlistToRender = InfiniteItemsToRender<
  Database['public']['Functions']['get_wishlist_items']['Returns']['items'][number]
>;

type UseWishlistsParams = {
  channel: DiscountChannels;
  sortOption: WishlistSortOption;
  isOnSale?: boolean;
};

const PAGE_SIZE = INFINITE_WISHLIST_PAGE_SIZE;

export function useWishlists({ channel, sortOption, isOnSale }: UseWishlistsParams) {
  const user = useUserStore(store => store.user);

  const queryKey = queryKeys.wishlists.byUserId({
    userId: user!.id,
    channel,
    sortField: sortOption.field,
    sortDirection: sortOption.orderDirection,
    isOnSale,
  });

  const { data, isFetching, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<InfiniteWishlistResultPages>({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey,
      queryFn: ({ pageParam }) => {
        return supabase.wishlists.fetchMyWishlistItems({
          userId: user!.id,
          channel,
          page: pageParam as number,
          pageSize: PAGE_SIZE,
          sortField: sortOption.field,
          sortDirection: sortOption.orderDirection,
          isOnSale,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if ((lastPage.items?.length ?? 0) < PAGE_SIZE) return null;
        return allPages.length;
      },
    });

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  const wishlistResult: WishlistToRender = useMemo(
    () =>
      data?.pages.flatMap(
        (page, index) => page.items?.map(item => ({ ...item, pageIndex: index })) ?? [],
      ) ?? [],
    [data?.pages],
  );

  return {
    wishlistResult,
    isLoading,
    isFetchingNextPage,
    handleEndReached,
    queryKey,
    totalResults: data?.pages[0].totalRecords ?? null,
  };
}
