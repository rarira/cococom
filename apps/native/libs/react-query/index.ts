import { CategorySectors, SortOptionDirection } from '@cococom/supabase/libs';
import { JoinedItems } from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import { DiscountChannels } from '@/constants';
import { wishlistQueryKeys } from '@/libs/react-query';
import { DiscountSortOption } from '@/libs/sort';

import { commentQueryKeys } from './comment';
import { itemQueryKeys } from './item';
import { memoQueryKeys } from './memo';

export * from './comment';
export * from './memo';
export * from './wishlist';

export const queryKeys = {
  category: {
    all: () => ['category', { currentTimestamp: new Date().toISOString().split('T')[0] }],
  },
  discounts: {
    currentList: (userId?: string | null, categorySector?: CategorySectors | null) => [
      'discounts',
      'currentList',
      { userId, currentTimestamp: new Date().toISOString().split('T')[0], categorySector },
    ],
    rankedList: ({
      channel,
      userId,
      limit,
      sortField,
      sortDirection,
    }: {
      channel: DiscountChannels;
      userId?: string | null;
      limit?: number;
      sortField: DiscountSortOption['field'];
      sortDirection: DiscountSortOption['orderBy'];
    }) => [
      'discounts',
      'rankedList',
      {
        userId,
        currentTimestamp: new Date().toISOString().split('T')[0],
        channel,
        limit,
        sortField,
        sortDirection,
      },
    ],
  },
  histories: {
    latest: ['histories', 'latest'],
  },
  search: {
    keyword: (
      keyword: string,
      isOnSaleSearch: boolean,
      sortField: string,
      sortDirecntion: SortOptionDirection,
      channelOption: DiscountChannels,
      userId?: string,
    ) => [
      'search',
      'keyword',
      { keyword, isOnSaleSearch, userId, sortField, sortDirecntion, channelOption },
    ],
    itemId: (
      itemId: string,
      isOnSaleSearch: boolean,
      sortField: string,
      sortDirecntion: SortOptionDirection,
      channelOption: DiscountChannels,
      userId?: string,
    ) => [
      'search',
      'itemId',
      { itemId, isOnSaleSearch, userId, sortField, sortDirecntion, channelOption },
    ],
  },
  wishlists: wishlistQueryKeys,
  items: itemQueryKeys,
  memos: memoQueryKeys,
  comments: commentQueryKeys,
  alltimeRankings: (
    channel: DiscountChannels,
    userId?: string | null,
    orderByColumn?: string,
    orderByDirection?: SortOptionDirection,
    limit?: number,
  ) => [
    'alltimeRankings',
    { channel, userId, sortField: orderByColumn, sortDirection: orderByDirection, limit },
  ],
};

export const handleMutateOfItems = async ({
  queryKey,
  queryClient,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
}) => {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData(queryKey) as unknown as JoinedItems;

  queryClient.setQueryData(queryKey, (old: JoinedItems) => {
    return {
      ...old,
      isWishlistedByUser: !old.isWishlistedByUser,
      totalWishlistCount: old.isWishlistedByUser
        ? old.totalWishlistCount - 1
        : old.totalWishlistCount + 1,
    };
  });

  return { previousData };
};
