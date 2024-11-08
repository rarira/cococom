import { CategorySectors, SortOptionDirection } from '@cococom/supabase/types';

import { DiscountChannels } from '@/constants';
import { DiscountSortOption } from '@/libs/sort';

import { commentQueryKeys } from './comment';
import { itemQueryKeys } from './item';
import { memoQueryKeys } from './memo';
import { wishlistQueryKeys } from './wishlist';

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
      sortDirection: DiscountSortOption['orderDirection'];
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
