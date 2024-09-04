import { useCallback, useMemo, useState } from 'react';

import { AlltimeSortOption } from '@/libs/sort';

export function useAlltimeRankingSort<T extends Record<string, AlltimeSortOption>>(
  sortOptions: T,
  callback: (sort: keyof T) => void,
) {
  const [sort, setSort] = useState<keyof T>('popular');

  const handleSortChange = useCallback(
    (sort: keyof T) => {
      setSort(sort);
      callback(sort);
    },
    [callback],
  );

  const sortOption = useMemo(() => sortOptions[sort], [sort, sortOptions]);

  return {
    sort,
    handleSortChange,
    sortOption,
  };
}
