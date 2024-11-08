import {
  InfiniteQueryResult,
  InfinitResultPagesWithTotalRecords,
  JoinedItems,
} from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

import { INFINITE_SEARCH_PAGE_SIZE } from '@/constants';
import { CurrentDiscounts } from '@/hooks/discount/useDiscountListQuery';

import { SortOption } from '../sort';

export const findInfinteIndexFromPreviousData = <T extends { id: number }[]>({
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

export const makeNewInfiniteQueryResult = <T extends { id: number }>(
  newFlatPages: T[],
  queryPageSize: number,
): InfiniteQueryResult<T[]> => {
  const pages = [];
  for (let i = 0; i < newFlatPages.length; i += queryPageSize) {
    pages.push(newFlatPages.slice(i, i + queryPageSize));
  }
  return { pages, pageParams: pages.map((_, index) => index) };
};

export const makeNewInfiniteObjectForOptimisticUpdate = <
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

export const findAllQueryKeysByUserId = (queryClient: QueryClient, userId: string) => {
  const allQueries = queryClient.getQueriesData({ type: 'all' });
  const allQueryKeys = allQueries.map(([queryKey]) => queryKey); // queryKey만 추출
  return allQueryKeys.filter((queryKey: QueryKey) => {
    return queryKey.some((key: any) => {
      return key.userId === userId;
    });
  });
};

export const sortFlatPagesBySortOption = <T extends Record<string, any>>(
  flatPages: T[],
  sortOption: SortOption,
) => {
  return flatPages.sort((a, b) => {
    const [prop1, prop2] = sortOption.field.split('.');

    const aValue = (!!prop2 ? a[prop1][prop2] : a[prop1]) as any;
    const bValue = (!!prop2 ? b[prop1][prop2] : b[prop1]) as any;

    if (aValue === bValue) {
      return 0;
    }

    if (sortOption.orderDirection === 'ASC') {
      return aValue > bValue ? 1 : -1;
    }

    return aValue < bValue ? 1 : -1;
  });
};

export const findInfinteIndexFromPreviousDataWithTotalRecords = <T extends { id: number }>({
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

const QueryWithTotalCounts: Record<string, number> = {
  discounts: 0,
  search: INFINITE_SEARCH_PAGE_SIZE,
  alltimeRankings: 0,
  items: 0,
};

const setQueryDataForDiscounts = ({
  old,
  itemId,
  totalCountsColumn,
  updateType,
}: {
  old: Awaited<CurrentDiscounts>;
  itemId: number;
  totalCountsColumn: 'totalCommentCount' | 'totalMemoCount';
  updateType: 'increase' | 'decrease';
}) => {
  const discountIndex = old.findIndex((d: any) => d.items.id === itemId);

  if (discountIndex === -1) return old;
  const updatedDiscount = {
    ...old[discountIndex],
    items: {
      ...old[discountIndex].items,
      [totalCountsColumn]:
        (old[discountIndex].items[totalCountsColumn] ?? 0) + (updateType === 'increase' ? 1 : -1),
    },
  };

  return [...old.slice(0, discountIndex), updatedDiscount, ...old.slice(discountIndex + 1)];
};

const setQueryDataForJoinedItems = ({
  old,
  itemId,
  totalCountsColumn,
  updateType,
}: {
  old: Pick<JoinedItems, 'id' | 'totalMemoCount' | 'totalCommentCount'>[];
  itemId: number;
  totalCountsColumn: 'totalCommentCount' | 'totalMemoCount';
  updateType: 'increase' | 'decrease';
}) => {
  const itemIndex = old.findIndex(i => i.id === itemId);

  if (itemIndex === -1) return old;

  const updatedItem = {
    ...old[itemIndex],
    [totalCountsColumn]:
      (old[itemIndex][totalCountsColumn] ?? 0) + (updateType === 'increase' ? 1 : -1),
  };

  return [...old.slice(0, itemIndex), updatedItem, ...old.slice(itemIndex + 1)] as JoinedItems[];
};

const setQueryDataForInfiniteResults = ({
  pageIndexOfItem,
  itemIndex,
  old,
  totalCountsColumn,
  updateType,
}: {
  pageIndexOfItem: number;
  itemIndex: number;
  old: InfiniteQueryResult<
    InfinitResultPagesWithTotalRecords<
      Pick<JoinedItems, 'id' | 'totalMemoCount' | 'totalCommentCount'>
    >
  >;
  totalCountsColumn: 'totalCommentCount' | 'totalMemoCount';
  updateType: 'increase' | 'decrease';
}) => {
  if (itemIndex === -1) return old;
  const updatedItem = {
    ...old.pages[pageIndexOfItem].items[itemIndex],
    [totalCountsColumn]:
      (old.pages[pageIndexOfItem].items[itemIndex][totalCountsColumn] ?? 0) +
      (updateType === 'increase' ? 1 : -1),
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

export const updateTotalCountInCache = ({
  itemId,
  queryClient,
  excludeQueryKey,
  totalCountsColumn,
  updateType,
}: {
  itemId: number;
  queryClient: QueryClient;
  excludeQueryKey?: keyof typeof QueryWithTotalCounts;
  totalCountsColumn: 'totalCommentCount' | 'totalMemoCount';
  updateType: 'increase' | 'decrease';
}) => {
  queryClient
    .getQueryCache()
    .findAll({ type: 'active' })
    .forEach(query => {
      if (
        !QueryWithTotalCounts.hasOwnProperty(query.queryKey[0] as string) ||
        query.queryKey[0] === excludeQueryKey
      )
        return;

      queryClient.setQueryData(query.queryKey, (oldData: unknown) => {
        if (!oldData) return oldData;

        if (Array.isArray(oldData)) {
          if (query.queryKey[0] === 'discounts') {
            return setQueryDataForDiscounts({
              old: oldData,
              itemId,
              totalCountsColumn,
              updateType,
            });
          }

          return setQueryDataForJoinedItems({
            old: oldData,
            itemId,
            totalCountsColumn,
            updateType,
          });
        }

        if (typeof oldData === 'object') {
          const { pageIndex, resourceIndex } = findInfinteIndexFromPreviousDataWithTotalRecords({
            previousData: oldData as InfiniteQueryResult<
              InfinitResultPagesWithTotalRecords<
                Pick<JoinedItems, 'id' | 'totalMemoCount' | 'totalCommentCount'>
              >
            >,
            queryPageSizeConstant: QueryWithTotalCounts[query.queryKey[0] as string] ?? 0,
            resourceId: itemId,
          });

          if (typeof pageIndex === 'undefined' || typeof resourceIndex === 'undefined')
            return oldData;

          return setQueryDataForInfiniteResults({
            pageIndexOfItem: pageIndex,
            itemIndex: resourceIndex,
            old: oldData as InfiniteQueryResult<
              InfinitResultPagesWithTotalRecords<
                Pick<JoinedItems, 'id' | 'totalMemoCount' | 'totalCommentCount'>
              >
            >,
            totalCountsColumn,
            updateType,
          });
        }

        return oldData;
      });
    });
};
