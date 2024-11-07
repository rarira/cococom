import {
  InfiniteQueryResult,
  InsertMemo,
  JoinedItems,
  JoinedMyMemos,
  Tables,
} from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import { INFINITE_MEMO_PAGE_SIZE } from '@/constants';

import { MyMemoSortOption } from '../sort/my-memo';
import {
  findInfinteIndexFromPreviousData,
  makeNewInfiniteObjectForOptimisticUpdate,
  makeNewInfiniteQueryResult,
  sortFlatPagesBySortOption,
} from './util';

export const memoQueryKeys = {
  byItem: (itemId: number, userId: string) => ['memos', 'byItem', { itemId, userId }],
  my: (userId: string, sortOption: MyMemoSortOption) => ['memos', 'my', { userId, sortOption }],
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

  if (previousData) {
    const { flatPages, flatIndex: flatMemoIndex } = findInfinteIndexFromPreviousData({
      previousData,
      queryPageSizeConstant: INFINITE_MEMO_PAGE_SIZE,
      resourceId: memoId,
      noNeedToFindIndex: true,
    });

    queryClient.setQueryData(queryKey, () => {
      const newFlatPages = [
        ...flatPages.slice(0, flatMemoIndex),
        ...flatPages.slice(flatMemoIndex! + 1),
      ];

      return makeNewInfiniteQueryResult(newFlatPages as any, INFINITE_MEMO_PAGE_SIZE);
    });
  }

  queryClient.setQueryData(itemQueryKey, (old: JoinedItems) => {
    if (!old) return old;

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

  if (typeof pageIndex === 'undefined') {
    queryClient.setQueryData(itemQueryKey, (old: JoinedItems) => {
      return {
        ...old,
        totalMemoCount: (old.totalMemoCount ?? 0) + 1,
      };
    });
  }

  return { previousData };
};

type UpdateMyMemosParams =
  | {
      memo: JoinedMyMemos;
      userId: string;
      queryClient: QueryClient;
      command: 'insert' | 'update';
    }
  | {
      memo: Pick<JoinedMyMemos, 'id'>;
      userId: string;
      queryClient: QueryClient;
      command: 'delete';
    };

export const updateMyMemos = ({ memo, userId, queryClient, command }: UpdateMyMemosParams) => {
  queryClient
    .getQueryCache()
    .findAll({
      type: 'active',
      queryKey: ['memos', 'my'],
      exact: false,
      predicate: query => {
        return (query.queryKey[2] as { userId: string }).userId === userId;
      },
    })
    .forEach(query => {
      const queryKey = query.queryKey;

      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryResult<JoinedMyMemos[]>) => {
        if (!oldData) return oldData; // 캐시가 비어있으면 스킵

        const flatPages = oldData.pages.flat();

        const sortOption = (queryKey[2] as { sortOption: MyMemoSortOption }).sortOption;

        if (command === 'insert') {
          const newFlatPages = [
            ...flatPages,
            {
              ...memo,
              item: {
                ...memo.item,
                totalCommentCount: (memo.item.totalMemoCount ?? 0) + 1,
              },
            },
          ];

          const sortedNewFlatPages = sortFlatPagesBySortOption(newFlatPages, sortOption);

          return makeNewInfiniteQueryResult(sortedNewFlatPages as any, INFINITE_MEMO_PAGE_SIZE);
        }

        if (command === 'update') {
          const oldMemoIndex = flatPages.findIndex(item => item.id === memo.id);

          flatPages[oldMemoIndex] = {
            ...flatPages[oldMemoIndex],
            ...memo,
          };

          return makeNewInfiniteQueryResult(flatPages as any, INFINITE_MEMO_PAGE_SIZE);
        }

        if (command === 'delete') {
          const newFlatPages = flatPages.filter(item => item.id !== memo.id);

          return makeNewInfiniteQueryResult(newFlatPages as any, INFINITE_MEMO_PAGE_SIZE);
        }

        return oldData;
      });
    });
};
