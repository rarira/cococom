import { InsertComment } from '@cococom/supabase/libs';
import {
  InfiniteQueryResult,
  InfinitResultPagesWithTotalRecords,
  JoinedComments,
  JoinedItems,
  Tables,
} from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import { INFINITE_COMMENT_PAGE_SIZE } from '@/constants';
import { MyCommentSortOption } from '@/libs/sort';

import {
  findInfinteIndexFromPreviousData,
  makeNewInfiniteObjectForOptimisticUpdate,
  makeNewInfiniteQueryResult,
} from './util';

import { queryKeys } from '.';

export const commentQueryKeys = {
  my: (userId: string, sortOption: MyCommentSortOption) => [
    'comments',
    'my',
    { userId, sortOption },
  ],
  byItem: (itemId: number) => ['comments', 'byItem', { itemId }],
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

export const updateMyCommentInCache = ({
  commentId,
  userId,
  queryClient,
}: {
  commentId: number;
  userId: string;
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
