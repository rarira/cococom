import { InfiniteQueryResult } from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

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
