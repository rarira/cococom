import { InsertWishlist } from '@cococom/supabase/libs';
import {
  InfiniteQueryResult,
  InfiniteWishlistResultPages,
  InfinitResultPagesWithTotalRecords,
  JoinedItems,
} from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import { DiscountChannels, INFINITE_SEARCH_PAGE_SIZE } from '@/constants';
import { CurrentDiscounts } from '@/hooks/discount/useDiscountListQuery';

import { WishlistSortOption } from '../sort';

import { queryKeys } from '.';

export const wishlistQueryKeys = {
  byUserId: ({
    userId,
    channel,
    sortField,
    sortDirection,
    isOnSale,
  }: {
    userId: string;
    channel: DiscountChannels;
    sortField: WishlistSortOption['field'];
    sortDirection: WishlistSortOption['orderBy'];
    isOnSale?: boolean;
  }) => ['wishlists', { userId, channel, sortField, sortDirection, isOnSale }],
};

const setQueryDataForDiscounts = (
  old: Awaited<CurrentDiscounts>,
  newWishlist: Pick<InsertWishlist, 'itemId'>,
) => {
  const discountIndex = old.findIndex((d: any) => d.items.id === newWishlist.itemId);

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
};

const setQueryDataForJoinedItems = (
  old: Pick<JoinedItems, 'id' | 'isWishlistedByUser' | 'totalWishlistCount'>[],
  newWishlist: Pick<InsertWishlist, 'itemId'>,
) => {
  const itemIndex = old.findIndex(d => d.id === newWishlist.itemId);

  const updatedItem = {
    ...old[itemIndex],
    totalWishlistCount: old[itemIndex].isWishlistedByUser
      ? old[itemIndex].totalWishlistCount - 1
      : old[itemIndex].totalWishlistCount + 1,
    isWishlistedByUser: !old[itemIndex].isWishlistedByUser,
  };

  return [...old.slice(0, itemIndex), updatedItem, ...old.slice(itemIndex + 1)] as JoinedItems[];
};

const setQueryDataForInfiniteResults = ({
  pageIndexOfItem,
  itemIndex,
  old,
}: {
  pageIndexOfItem: number;
  itemIndex: number;
  old: InfiniteQueryResult<
    InfinitResultPagesWithTotalRecords<
      Pick<JoinedItems, 'id' | 'isWishlistedByUser' | 'totalWishlistCount'>
    >
  >;
  newWishlist: Pick<InsertWishlist, 'itemId'>;
}) => {
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
};

const findInfinteIndexFromPreviousDataWithTotalRecords = <T extends { id: number }>({
  previousData,
  queryPageSizeConstant,
  resourceId,
  noNeedToFindIndex,
}: {
  previousData: InfiniteQueryResult<InfinitResultPagesWithTotalRecords<T>>;
  queryPageSizeConstant: number;
  resourceId?: number;
  noNeedToFindIndex?: boolean;
}) => {
  let pageIndex = undefined;
  let resourceIndex = undefined;

  const flatPages = previousData?.pages.flat();

  const flatItemsPages = flatPages.reduce((acc, page) => {
    acc.push(...page.items);
    return acc;
  }, [] as T[]);

  const flatIndex = resourceId
    ? flatItemsPages.findIndex(resource => resource.id === resourceId)
    : -1;

  if (noNeedToFindIndex) {
    return { flatPages, flatIndex };
  }

  if (flatIndex === -1) {
    return { flatPages, pageIndex, resourceIndex };
  }

  pageIndex = Math.floor(flatIndex / queryPageSizeConstant);
  resourceIndex = flatIndex % queryPageSizeConstant;

  return { pageIndex, resourceIndex, flatPages };
};

export const handleMutateOfWishlist = async ({
  queryClient,
  queryKey,
  newWishlist,
  pageIndexOfItem,
  callback,
}: {
  queryClient: QueryClient;
  newWishlist: Pick<InsertWishlist, 'itemId'>;
  queryKey: QueryKey;
  pageIndexOfItem: number;
  callback?: () => void;
}) => {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData(
    queryKey,
  ) as unknown as InfiniteQueryResult<InfiniteWishlistResultPages>;

  queryClient.setQueryData(queryKey, (old: InfiniteQueryResult<InfiniteWishlistResultPages>) => {
    const { items, ...restPages } = old.pages[pageIndexOfItem];

    const updatedPage = {
      ...restPages,
      items: items.filter(item => item.id !== newWishlist.itemId),
    };

    const { pages, ...restOld } = old;

    return {
      ...restOld,
      pages: [...pages.slice(0, pageIndexOfItem), updatedPage, ...pages.slice(pageIndexOfItem + 1)],
    };
  });
  callback?.();

  updateWishlistInCache({ itemId: newWishlist.itemId, queryClient });

  return { previousData };
};

const QueryWithWishlist: { [property in keyof Partial<typeof queryKeys>]: number } = {
  discounts: 0,
  search: INFINITE_SEARCH_PAGE_SIZE,
  alltimeRankings: 0,
};

export const updateWishlistInCache = ({
  itemId,
  queryClient,
}: {
  itemId: number;
  queryClient: QueryClient;
}) => {
  // queryCache의 모든 쿼리 항목을 순회
  queryClient
    .getQueryCache()
    .findAll({ type: 'active' })
    .forEach(query => {
      if (!QueryWithWishlist.hasOwnProperty((query.queryKey as (keyof typeof queryKeys)[])[0]))
        return;

      // if (Util.compareArray(queryKey, query.queryKey)) return;

      queryClient.setQueryData(query.queryKey, (oldData: unknown) => {
        if (!oldData) return oldData; // 캐시가 비어있으면 스킵

        if (Array.isArray(oldData)) {
          if (query.queryKey[0] === 'discounts') {
            return setQueryDataForDiscounts(oldData, { itemId });
          }

          return setQueryDataForJoinedItems(oldData, { itemId });
        }

        if (typeof oldData === 'object') {
          const { pageIndex, resourceIndex } = findInfinteIndexFromPreviousDataWithTotalRecords({
            previousData: oldData as InfiniteQueryResult<
              InfinitResultPagesWithTotalRecords<
                Pick<JoinedItems, 'id' | 'isWishlistedByUser' | 'totalWishlistCount'>
              >
            >,
            queryPageSizeConstant:
              QueryWithWishlist[query.queryKey[0] as keyof Partial<typeof queryKeys>] ?? 0,
            resourceId: itemId,
          });

          if (typeof pageIndex === 'undefined' || typeof resourceIndex === 'undefined')
            return oldData;

          return setQueryDataForInfiniteResults({
            pageIndexOfItem: pageIndex,
            itemIndex: resourceIndex,
            old: oldData as InfiniteQueryResult<
              InfinitResultPagesWithTotalRecords<
                Pick<JoinedItems, 'id' | 'isWishlistedByUser' | 'totalWishlistCount'>
              >
            >,
            newWishlist: { itemId },
          });
        }

        return oldData;
      });
    });
};
