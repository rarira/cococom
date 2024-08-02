import { useCallback, useState } from 'react';

import { DISCOUNT_SORT_OPTIONS } from '@/libs/sort';

export function useDiscountsSort(callback: (sort: keyof typeof DISCOUNT_SORT_OPTIONS) => void) {
  const [sort, setSort] = useState<keyof typeof DISCOUNT_SORT_OPTIONS>('biggest');

  const handleSortChange = useCallback(
    (sort: keyof typeof DISCOUNT_SORT_OPTIONS) => {
      setSort(sort);
      callback(sort);
    },
    [callback],
  );

  return {
    sort,
    handleSortChange,
  };
}
