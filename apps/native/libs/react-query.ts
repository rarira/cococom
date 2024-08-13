import {
  CategorySectors,
  InsertWishlist,
  SearchItemSortDirection,
  SearchItemSortField,
} from '@cococom/supabase/libs';
import { JoinedItems } from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import { InfiniteSearchResultData } from '@/libs/search';

export const queryKeys = {
  discounts: {
    currentList: (userId?: string | null, categorySector?: CategorySectors | null) => [
      'discounts',
      { userId, currentTimestamp: new Date().toISOString().split('T')[0], categorySector },
    ],
    currentListByCategorySector: () => [
      'discounts',
      { currentTimestamp: new Date().toISOString().split('T')[0] },
    ],
  },
  histories: {
    latest: ['histories', 'latest'],
  },
  search: {
    keyword: (
      keyword: string,
      isOnSaleSearch: boolean,
      sortField: SearchItemSortField,
      sortDirecntion: SearchItemSortDirection,
      userId?: string,
    ) => ['search', { keyword, isOnSaleSearch, userId, sortField, sortDirecntion }],
    itemId: (
      itemId: string,
      isOnSaleSearch: boolean,
      sortField: SearchItemSortField,
      sortDirecntion: SearchItemSortDirection,
      userId?: string,
    ) => ['search', { itemId, isOnSaleSearch, userId, sortField, sortDirecntion }],
  },
  items: {
    byId: (id: number) => ['items', { id }],
  },
};

export const handleMutateOfDiscountCurrentList = async ({
  queryClient,
  queryKey,
  newWishlist,
}: {
  queryClient: QueryClient;
  newWishlist: InsertWishlist;
  queryKey: QueryKey;
}) => {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData(queryKey) as unknown as JoinedItems[];

  const discountIndex = previousData?.findIndex((d: any) => d.items.id === newWishlist.itemId);

  queryClient.setQueryData(queryKey, (old: any) => {
    if (discountIndex === -1) return old;
    const updatedDiscount = {
      ...old[discountIndex],
      items: {
        ...old[discountIndex].items,
        totalWishlistCount: old[discountIndex].items.isWishlistedByUser
          ? old[discountIndex].items.totalWishlistCount - 1
          : old[discountIndex].items.totalWishlistCount + 1,
        isWishlistedByUser: !old[discountIndex].items.isWishlistedByUser,
      },
    };

    return [...old.slice(0, discountIndex), updatedDiscount, ...old.slice(discountIndex + 1)];
  });

  return { previousData };
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

export const handleMutateOfSearchResult = async ({
  queryClient,
  queryKey,
  newWishlist,
  pageIndexOfItem,
}: {
  queryClient: QueryClient;
  newWishlist: InsertWishlist;
  queryKey: QueryKey;
  pageIndexOfItem: number;
}) => {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData(queryKey) as unknown as InfiniteSearchResultData;

  const itemIndex = previousData.pages[pageIndexOfItem].items.findIndex(
    item => item.id === newWishlist.itemId,
  );

  queryClient.setQueryData(queryKey, (old: InfiniteSearchResultData) => {
    if (itemIndex === -1) return old;
    const updatedItem = {
      ...old.pages[pageIndexOfItem].items[itemIndex],
      totalWishlistCount: old.pages[pageIndexOfItem].items[itemIndex].isWishlistedByUser
        ? old.pages[pageIndexOfItem].items[itemIndex].totalWishlistCount - 1
        : old.pages[pageIndexOfItem].items[itemIndex].totalWishlistCount + 1,
      isWishlistedByUser: !old.pages[pageIndexOfItem].items[itemIndex].isWishlistedByUser,
    };

    const { items, ...restPages } = old.pages[pageIndexOfItem];

    const updatedPage = {
      ...restPages,
      items: [...items.slice(0, itemIndex), updatedItem, ...items.slice(itemIndex + 1)],
    };

    const { pages, ...restOld } = old;

    return {
      ...restOld,
      pages: [...pages.slice(0, pageIndexOfItem), updatedPage, ...pages.slice(pageIndexOfItem + 1)],
    };
  });

  return { previousData };
};
