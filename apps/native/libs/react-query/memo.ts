import { InsertMemo } from '@cococom/supabase/libs';
import { InfiniteQueryResult, JoinedItems, Tables } from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import { INFINITE_MEMO_PAGE_SIZE } from '@/constants';

import {
  findInfinteIndexFromPreviousData,
  makeNewInfiniteObjectForOptimisticUpdate,
  makeNewInfiniteQueryResult,
} from './util';

export const memoQueryKeys = {
  byItem: (itemId: number, userId: string) => ['memos', 'byItem', { itemId, userId }],
  byUserId: (userId: string) => ['memos', 'byUserId', { userId }],
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
