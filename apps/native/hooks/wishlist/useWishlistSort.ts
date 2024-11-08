import { useSort } from '@/hooks/sort/useSort';
import { WishlistSortOption } from '@/libs/sort';

export function useWishlistSort<T extends Record<string, WishlistSortOption>>(
  sortOptions: T,
  callback: (sort: keyof T) => void,
) {
  return useSort({
    sortOptions,
    callback,
    initialSort: 'recent',
  });
}
