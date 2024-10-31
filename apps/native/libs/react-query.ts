import {
  CategorySectors,
  InsertComment,
  InsertMemo,
  SearchItemSortDirection,
  SearchItemSortField,
} from '@cococom/supabase/libs';
import { InfiniteQueryResult, JoinedComments, JoinedItems, Tables } from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import { DiscountChannels, INFINITE_COMMENT_PAGE_SIZE, INFINITE_MEMO_PAGE_SIZE } from '@/constants';
import { DiscountSortOption, MySortOption } from '@/libs/sort';
import { wishlistQueryKeys } from '@/libs/wishlist';

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
      sortField: SearchItemSortField,
      sortDirecntion: SearchItemSortDirection,
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
      sortField: SearchItemSortField,
      sortDirecntion: SearchItemSortDirection,
      channelOption: DiscountChannels,
      userId?: string,
    ) => [
      'search',
      'itemId',
      { itemId, isOnSaleSearch, userId, sortField, sortDirecntion, channelOption },
    ],
  },
  wishlists: wishlistQueryKeys,
  items: {
    byId: (id: number, userId?: string) => ['items', { id, userId }],
  },
  memos: {
    byItem: (itemId: number, userId: string) => ['memos', { itemId, userId }],
    byUserId: (userId: string) => ['memos', { userId }],
  },
  comments: {
    my: (userId: string, sortOption: MySortOption) => ['comments', { userId, sortOption }],
    byItem: (itemId: number) => ['comments', { itemId }],
  },
  alltimeRankings: (
    channel: DiscountChannels,
    userId?: string | null,
    orderByColumn?: string,
    orderByDirection?: 'asc' | 'desc',
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

const findInfinteIndexFromPreviousData = <T extends { id: number }[]>({
  previousData,
  queryPageSizeConstant,
  resourceId,
  noNeedToFindIndex,
}: {
  previousData: InfiniteQueryResult<T>;
  queryPageSizeConstant: number;
  resourceId?: number;
  noNeedToFindIndex?: boolean;
}) => {
  let pageIndex = undefined;
  let resourceIndex = undefined;

  const flatPages = previousData?.pages.flat();

  const flatIndex = resourceId
    ? flatPages.findIndex(resource => (resource as { id: number }).id === resourceId)
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

const makeNewInfiniteQueryResult = <T extends { id: number }>(
  newFlatPages: T[],
  queryPageSize: number,
): InfiniteQueryResult<T[]> => {
  const pages = [];
  for (let i = 0; i < newFlatPages.length; i += queryPageSize) {
    pages.push(newFlatPages.slice(i, i + queryPageSize));
  }
  return { pages, pageParams: pages.map((_, index) => index) };
};

const makeNewInfiniteObjectForOptimisticUpdate = <
  T extends {
    [key: string]: unknown;
  },
>(
  newObject: T,
  newId: number,
  needUpdateAt?: boolean,
) => {
  return {
    ...newObject,
    id: newObject.id || newId,
    created_at: newObject.created_at || new Date().toISOString(),
    updated_at: needUpdateAt ? new Date().toISOString() : undefined,
  };
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
    queryPageSizeConstant: INFINITE_MEMO_PAGE_SIZE,
    resourceId: memoId,
    noNeedToFindIndex: true,
  });

  queryClient.setQueryData(queryKey, (old: JoinedItems) => {
    const newFlatPages = [
      ...flatPages.slice(0, flatMemoIndex),
      ...flatPages.slice(flatMemoIndex! + 1),
    ];

    return makeNewInfiniteQueryResult(newFlatPages as any, INFINITE_MEMO_PAGE_SIZE);
  });

  queryClient.setQueryData(itemQueryKey, (old: JoinedItems) => {
    return {
      ...old,
      totalMemoCount: old.totalMemoCount! - 1,
    };
  });

  return { previousData };
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
    queryPageSizeConstant: INFINITE_MEMO_PAGE_SIZE,
    resourceId: newMemo.id,
  });

  queryClient.setQueryData(queryKey, (old: InfiniteQueryResult<Tables<'memos'>[]>) => {
    if (typeof pageIndex === 'undefined') {
      const newFlatPages = [
        makeNewInfiniteObjectForOptimisticUpdate<InsertMemo>(
          newMemo,
          (flatPages[0]?.id ?? Infinity - 2) + 1,
          true,
        ),
        ...flatPages,
      ];
      return makeNewInfiniteQueryResult(newFlatPages as any, INFINITE_MEMO_PAGE_SIZE);
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
      totalMemoCount: (old.totalMemoCount ?? 0) + 1,
    };
  });

  return { previousData };
};

export const handleMutateOfInsertComment = async ({
  queryClient,
  queryKey,
  newComment,
  itemQueryKey,
  needSort,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
  newComment: InsertComment;
  itemQueryKey: QueryKey;
  needSort?: boolean;
}) => {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData(queryKey) as unknown as InfiniteQueryResult<
    JoinedComments[]
  >;

  const {
    flatPages,
    pageIndex,
    resourceIndex: commentIndex,
  } = findInfinteIndexFromPreviousData({
    previousData,
    queryPageSizeConstant: INFINITE_COMMENT_PAGE_SIZE,
    resourceId: newComment.id,
  });

  queryClient.setQueryData(queryKey, (old: InfiniteQueryResult<Tables<'comments'>[]>) => {
    if (typeof pageIndex === 'undefined') {
      const newFlatPages = [
        makeNewInfiniteObjectForOptimisticUpdate(
          newComment,
          (flatPages[0]?.id ?? Infinity - 2) + 1,
        ),
        ...flatPages,
      ];
      if (needSort) {
        newFlatPages.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      }

      return makeNewInfiniteQueryResult(newFlatPages as any, INFINITE_COMMENT_PAGE_SIZE);
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
      totalCommentCount: (old.totalCommentCount ?? 0) + 1,
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
    JoinedComments[]
  >;

  const { flatPages, flatIndex: flatMemoIndex } = findInfinteIndexFromPreviousData({
    previousData,
    queryPageSizeConstant: INFINITE_COMMENT_PAGE_SIZE,
    resourceId: commentId,
    noNeedToFindIndex: true,
  });

  queryClient.setQueryData(queryKey, (old: JoinedItems) => {
    const newFlatPages = [
      ...flatPages.slice(0, flatMemoIndex),
      ...flatPages.slice(flatMemoIndex! + 1),
    ];

    return makeNewInfiniteQueryResult(newFlatPages as any, INFINITE_COMMENT_PAGE_SIZE);
  });

  queryClient.setQueryData(itemQueryKey, (old: JoinedItems) => {
    return {
      ...old,
      totalCommentCount: old.totalCommentCount! - 1,
    };
  });

  return { previousData };
};

export const findAllQueryKeysByUserId = (queryClient: QueryClient, userId: string) => {
  const allQueries = queryClient.getQueriesData({ type: 'all' });
  const allQueryKeys = allQueries.map(([queryKey]) => queryKey); // queryKey만 추출
  return allQueryKeys.filter((queryKey: QueryKey) => {
    return queryKey.some((key: any) => {
      return key.userId === userId;
    });
  });
};
