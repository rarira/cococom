import { useCallback, useMemo, useState } from 'react';

import { WishlistSortOption } from '@/libs/sort';

export function useWishlistSort<T extends Record<string, WishlistSortOption>>(
  sortOptions: T,
  callback: (sort: keyof T) => void,
) {
  const [sort, setSort] = useState<keyof T>('recent');

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
