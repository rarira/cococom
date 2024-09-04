import { useCallback, useMemo, useState } from 'react';

import { DiscountSortOption } from '@/libs/sort';

export function useDiscountsSort<T extends Record<string, DiscountSortOption>>(
  sortOptions: T,
  callback: (sort: keyof T) => void,
) {
  const [sort, setSort] = useState<keyof T>('biggest');

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
