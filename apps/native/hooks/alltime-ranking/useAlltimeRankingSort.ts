import { AlltimeSortOption } from '@/libs/sort';

import { useSort } from '../sort/useSort';

export function useAlltimeRankingSort<T extends Record<string, AlltimeSortOption>>(
  sortOptions: T,
  callback: (sort: keyof T) => void,
) {
  return useSort({
    sortOptions,
    callback,
    initialSort: 'popular',
  });
}
