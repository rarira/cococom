import {
  InfiniteQueryResult,
  InsertComment,
  JoinedComments,
  JoinedItems,
  JoinedMyComments,
  Tables,
} from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import { INFINITE_COMMENT_PAGE_SIZE } from '@/constants';
import { MyCommentSortOption } from '@/libs/sort';

import {
  findInfinteIndexFromPreviousData,
  makeNewInfiniteObjectForOptimisticUpdate,
  makeNewInfiniteQueryResult,
  sortFlatPagesBySortOption,
} from './util';

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
  newComment: InsertComment & { author: { id: string; nickname?: string | null } };
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
      totalCommentCount: (old?.totalCommentCount ?? 0) + 1,
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

  const { flatPages, flatIndex: flatCommentIndex } = findInfinteIndexFromPreviousData({
    previousData,
    queryPageSizeConstant: INFINITE_COMMENT_PAGE_SIZE,
    resourceId: commentId,
    noNeedToFindIndex: true,
  });

  queryClient.setQueryData(queryKey, (old: JoinedItems) => {
    const newFlatPages = [
      ...flatPages.slice(0, flatCommentIndex),
      ...flatPages.slice(flatCommentIndex! + 1),
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

export type UpdateMyCommentInCacheParams =
  | {
      comment: JoinedMyComments;
      userId: string;
      queryClient: QueryClient;
      command: 'insert';
    }
  | {
      comment: Pick<JoinedMyComments, 'id'>;
      userId: string;
      queryClient: QueryClient;
      command: 'delete';
    };

export const updateMyCommentInCache = ({
  comment,
  userId,
  queryClient,
  command,
}: UpdateMyCommentInCacheParams) => {
  queryClient
    .getQueryCache()
    .findAll({
      type: 'active',
      queryKey: ['comments', 'my'],
      exact: false,
      predicate: query => {
        return (query.queryKey[2] as { userId: string }).userId === userId;
      },
    })
    .forEach(query => {
      const queryKey = query.queryKey;

      queryClient.setQueryData(queryKey, (oldData: InfiniteQueryResult<JoinedComments[]>) => {
        if (!oldData) return oldData; // 캐시가 비어있으면 스킵

        const flatPages = oldData.pages.flat();

        const sortOption = (queryKey[2] as { sortOption: MyCommentSortOption }).sortOption;

        if (command === 'insert') {
          const newFlatPages = [
            ...flatPages,
            {
              ...comment,
              item: {
                ...comment.item,
                totalCommentCount: (comment.item.totalCommentCount ?? 0) + 1,
              },
            },
          ];

          const sortedNewFlatPages = sortFlatPagesBySortOption(newFlatPages, sortOption);

          return makeNewInfiniteQueryResult(sortedNewFlatPages as any, INFINITE_COMMENT_PAGE_SIZE);
        }

        if (command === 'delete') {
          const newFlatPages = flatPages.filter(item => item.id !== comment.id);

          return makeNewInfiniteQueryResult(newFlatPages as any, INFINITE_COMMENT_PAGE_SIZE);
        }

        return oldData;
      });
    });
};
