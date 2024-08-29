import {
  CategorySectors,
  InsertComment,
  InsertMemo,
  InsertWishlist,
  SearchItemSortDirection,
  SearchItemSortField,
} from '@cococom/supabase/libs';
import { JoinedItems, Tables } from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import { COMMENT_INFINITE_QUERY_PAGE_SIZE, MEMO_INFINITE_QUERY_PAGE_SIZE } from '@/constants';
import { InfiniteSearchResultData } from '@/libs/search';

export type InfiniteQueryResult<T> = {
  pageParams: number[];
  pages: T[];
};

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
    byId: (id: number, userId?: string) => ['items', { id, userId }],
  },
  memos: {
    byItem: (itemId: number, userId: string) => ['memos', { itemId, userId }],
    byUserId: (userId: string) => ['memos', { userId }],
  },
  comments: {
    byItem: (itemId: number) => ['comments', { itemId }],
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

const findInfinteIndexFromPreviousData = <T extends { id: number }>({
  previousData,
  queryPageSizeConstant,
  resourceId,
  noNeedToFindIndex,
}: {
  previousData: InfiniteQueryResult<T[]>;
  queryPageSizeConstant: number;
  resourceId?: number;
  noNeedToFindIndex?: boolean;
}) => {
  let pageIndex = undefined;
  let resourceIndex = undefined;

  const flatPages = previousData?.pages.flat();

  const flatIndex = resourceId ? flatPages.findIndex(memo => memo.id === resourceId) : -1;

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

const makeNewInfiniteQueryResult = <T>(newFlatPages: T[], queryPageSize: number) => {
  const newPages = newFlatPages.reduce((acc, resource, index) => {
    if (index % queryPageSize === 0) {
      acc.push([resource]);
    } else {
      acc[acc.length - 1].push(resource);
    }
    return acc;
  }, [] as T[][]);

  return {
    pageParams: Array.from({ length: newPages.length }, (_, i) => i + 1),
    pages: newPages,
  };
};

const makeNewInfiniteObjectForOptimisticUpdate = <T>(
  newObject: T,
  newId: number,
  needUpdateAt?: boolean,
) => {
  return {
    ...newObject,
    id: newId,
    created_at: new Date().toISOString(),
    updated_at: needUpdateAt ? new Date().toISOString() : undefined,
  };
};

export const handleMutateOfUpsertMemo = async ({
  queryClient,
  queryKey,
  newMemo,
  itemQueryKey,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  newMemo: InsertMemo;
  itemQueryKey: QueryKey;
}) => {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData(queryKey) as unknown as InfiniteQueryResult<
    Tables<'memos'>[]
  >;

  const {
    flatPages,
    pageIndex,
    resourceIndex: memoIndex,
  } = findInfinteIndexFromPreviousData({
    previousData,
    queryPageSizeConstant: MEMO_INFINITE_QUERY_PAGE_SIZE,
    resourceId: newMemo.id,
  });

  queryClient.setQueryData(queryKey, (old: InfiniteQueryResult<Tables<'memos'>[]>) => {
    if (typeof pageIndex === 'undefined') {
      const newFlatPages = [
        makeNewInfiniteObjectForOptimisticUpdate(newMemo, (flatPages[0]?.id ?? 0) + 1, true),
        ...flatPages,
      ];
      return makeNewInfiniteQueryResult(newFlatPages as any, MEMO_INFINITE_QUERY_PAGE_SIZE);
    }

    newMemo.updated_at = new Date().toISOString();

    return {
      ...old,
      pages: [
        ...old.pages.slice(0, pageIndex),
        [
          ...old.pages[pageIndex].slice(0, memoIndex),
          newMemo,
          ...old.pages[pageIndex].slice(memoIndex + 1),
        ],
        ...old.pages.slice(pageIndex + 1),
      ],
    };
  });

  queryClient.setQueryData(itemQueryKey, (old: JoinedItems) => {
    return {
      ...old,
      memosLength: (old.memosLength ?? 0) + 1,
    };
  });

  return { previousData };
};

export const handleMutateOfDeleteMemo = async ({
  queryClient,
  queryKey,
  memoId,
  itemQueryKey,
}: {
  queryClient: QueryClient;
  memoId?: number;
  queryKey: QueryKey;
  itemQueryKey: QueryKey;
}) => {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData(queryKey) as unknown as InfiniteQueryResult<
    Tables<'memos'>[]
  >;

  const { flatPages, flatIndex: flatMemoIndex } = findInfinteIndexFromPreviousData({
    previousData,
    queryPageSizeConstant: MEMO_INFINITE_QUERY_PAGE_SIZE,
    resourceId: memoId,
    noNeedToFindIndex: true,
  });

  queryClient.setQueryData(queryKey, (old: JoinedItems) => {
    const newFlatPages = [
      ...flatPages.slice(0, flatMemoIndex),
      ...flatPages.slice(flatMemoIndex! + 1),
    ];

    return makeNewInfiniteQueryResult(newFlatPages as any, MEMO_INFINITE_QUERY_PAGE_SIZE);
  });

  queryClient.setQueryData(itemQueryKey, (old: JoinedItems) => {
    return {
      ...old,
      memosLength: old.memosLength! - 1,
    };
  });

  return { previousData };
};

export const handleMutateOfInsertComment = async ({
  queryClient,
  queryKey,
  newComment,
  itemQueryKey,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  newComment: InsertComment;
  itemQueryKey: QueryKey;
}) => {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData(queryKey) as unknown as InfiniteQueryResult<
    Tables<'comments'>[]
  >;

  const {
    flatPages,
    pageIndex,
    resourceIndex: commentIndex,
  } = findInfinteIndexFromPreviousData({
    previousData,
    queryPageSizeConstant: COMMENT_INFINITE_QUERY_PAGE_SIZE,
    resourceId: newComment.id,
  });

  queryClient.setQueryData(queryKey, (old: InfiniteQueryResult<Tables<'comments'>[]>) => {
    if (typeof pageIndex === 'undefined') {
      const newFlatPages = [
        makeNewInfiniteObjectForOptimisticUpdate(newComment, (flatPages[0]?.id ?? 0) + 1),
        ...flatPages,
      ];
      return makeNewInfiniteQueryResult(newFlatPages as any, MEMO_INFINITE_QUERY_PAGE_SIZE);
    }

    return {
      ...old,
      pages: [
        ...old.pages.slice(0, pageIndex),
        [
          ...old.pages[pageIndex].slice(0, commentIndex),
          newComment,
          ,
          ...old.pages[pageIndex].slice(commentIndex + 1),
        ],
        ...old.pages.slice(pageIndex + 1),
      ],
    };
  });

  queryClient.setQueryData(itemQueryKey, (old: JoinedItems) => {
    return {
      ...old,
      commentsLength: (old.commentsLength ?? 0) + 1,
    };
  });

  return { previousData };
};

export const handleMutateOfDeleteComment = async ({
  queryClient,
  queryKey,
  commentId,
  itemQueryKey,
}: {
  queryClient: QueryClient;
  commentId?: number;
  queryKey: QueryKey;
  itemQueryKey: QueryKey;
}) => {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData(queryKey) as unknown as InfiniteQueryResult<
    Tables<'memos'>[]
  >;

  const { flatPages, flatIndex: flatMemoIndex } = findInfinteIndexFromPreviousData({
    previousData,
    queryPageSizeConstant: MEMO_INFINITE_QUERY_PAGE_SIZE,
    resourceId: commentId,
    noNeedToFindIndex: true,
  });

  queryClient.setQueryData(queryKey, (old: JoinedItems) => {
    const newFlatPages = [
      ...flatPages.slice(0, flatMemoIndex),
      ...flatPages.slice(flatMemoIndex! + 1),
    ];

    return makeNewInfiniteQueryResult(newFlatPages as any, MEMO_INFINITE_QUERY_PAGE_SIZE);
  });

  queryClient.setQueryData(itemQueryKey, (old: JoinedItems) => {
    return {
      ...old,
      commentsLength: old.commentsLength! - 1,
    };
  });

  return { previousData };
};
