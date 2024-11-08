import { DiscountSortOption } from '@/libs/sort';

import { useSort } from '../sort/useSort';

export function useDiscountsSort<T extends Record<string, DiscountSortOption>>(
  sortOptions: T,
  callback: (sort: keyof T) => void,
) {
  return useSort({
    sortOptions,
    callback,
    initialSort: 'biggest',
  });
}
