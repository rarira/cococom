import {
  CategorySectors,
  InsertComment,
  InsertMemo,
  InsertWishlist,
  SearchItemSortDirection,
  SearchItemSortField,
} from '@cococom/supabase/libs';
import {
  InfiniteQueryResult,
  InfiniteWishlistResultPages,
  InfinitResultPagesWithTotalRecords,
  JoinedComments,
  JoinedItems,
  Tables,
} from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import {
  DiscountChannels,
  INFINITE_COMMENT_PAGE_SIZE,
  INFINITE_MEMO_PAGE_SIZE,
  INFINITE_SEARCH_PAGE_SIZE,
} from '@/constants';
import { CurrentDiscounts } from '@/hooks/discount/useDiscountListQuery';

import { WishlistSortOption } from './sort';

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
    rankedList: (channel: DiscountChannels, userId?: string | null, limit?: number) => [
      'discounts',
      'rankedList',
      { userId, currentTimestamp: new Date().toISOString().split('T')[0], channel, limit },
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
  wishlists: {
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
  alltimeRankings: (
    channel: DiscountChannels,
    userId?: string | null,
    orderByColumn?: string,
    orderByDirection?: 'asc' | 'desc',
    limit?: number,
  ) => ['alltimeRankings', { channel, userId, orderByColumn, orderByDirection, limit }],
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

const makeNewInfiniteQueryResult = <T>(newFlatPages: T[], queryPageSize: number) => {
  const pages = [];
  for (let i = 0; i < newFlatPages.length; i += queryPageSize) {
    pages.push(newFlatPages.slice(i, i + queryPageSize));
  }
  return { pages };
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
          (flatPages[0]?.id ?? Infinity - 1) + 1,
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
          (flatPages[0]?.id ?? Infinity - 1) + 1,
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

export const findAllQueryKeysByUserId = (queryClient: QueryClient, userId: string) => {
  const allQueries = queryClient.getQueriesData({ type: 'all' });
  const allQueryKeys = allQueries.map(([queryKey]) => queryKey); // queryKey만 추출
  return allQueryKeys.filter((queryKey: QueryKey) => {
    return queryKey.some((key: any) => {
      return key.userId === userId;
    });
  });
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

      // 자기 optimistic update도 수행
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
