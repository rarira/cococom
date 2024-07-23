import { CategorySectors } from '@cococom/supabase/libs';
import { Database, JoinedItems } from '@cococom/supabase/types';

import { ListItemCardProps } from '@/components/custom/card/list-item';

import { queryKeys } from './react-query';

type DiscountSortOption = {
  field:
    | keyof Database['public']['Functions']['get_discounts_with_wishlist_counts']['Returns'][0]
    | `items.${keyof JoinedItems}`;
  orderBy: 'asc' | 'desc';
  text: string;
};

export const DISCOUNT_SORT_OPTIONS: Record<string, DiscountSortOption> = {
  biggest: {
    field: 'discountRate',
    orderBy: 'desc',
    text: '할인율 높은 순',
  },
  smallest: {
    field: 'discountRate',
    orderBy: 'asc',
    text: '할인율 낮은 순',
  },
  cheapset: {
    field: 'discountPrice',
    orderBy: 'asc',
    text: '할인가 낮은 순',
  },
  expensive: {
    field: 'discountPrice',
    orderBy: 'desc',
    text: '할인가 높은 순',
  },
  Approaching: {
    field: 'endDate',
    orderBy: 'asc',
    text: '마감 임박 순',
  },
  newest: {
    field: 'startDate',
    orderBy: 'desc',
    text: '최신순',
  },
  popular: {
    field: 'items.totalWishlistCount',
    orderBy: 'desc',
    text: '인기순',
  },
  frequent: {
    field: 'items.discountsLength',
    orderBy: 'desc',
    text: '할인 빈도 많은 순',
  },
  rare: {
    field: 'items.discountsLength',
    orderBy: 'asc',
    text: '할인 빈도 적은 순',
  },
};

export function sortDiscountsByCategorySector(
  sortKey: keyof typeof DISCOUNT_SORT_OPTIONS,
  data: ListItemCardProps['discount'][],
) {
  return [...data].sort((a: ListItemCardProps['discount'], b: ListItemCardProps['discount']) => {
    const sortOption = DISCOUNT_SORT_OPTIONS[sortKey];
    const [prop1, prop2] = sortOption.field.split('.');

    const aValue = (!!prop2 ? a[prop1][prop2] : a[prop1]) as any;
    const bValue = (!!prop2 ? b[prop1][prop2] : b[prop1]) as any;

    if (aValue === bValue) {
      return 0;
    }

    if (sortOption.orderBy === 'asc') {
      return aValue > bValue ? 1 : -1;
    }

    return aValue < bValue ? 1 : -1;
  });
}

export function updateDiscountsByCategorySectorCache({
  userId,
  sortKey,
  queryClient,
  categorySector,
}: {
  userId?: string;
  sortKey: keyof typeof DISCOUNT_SORT_OPTIONS;
  queryClient: any;
  categorySector?: CategorySectors;
}) {
  const queryKey = queryKeys.discounts.currentList(userId, categorySector);

  queryClient.setQueryData(queryKey, (prevData: ListItemCardProps['discount'][]) => {
    return sortDiscountsByCategorySector(sortKey, prevData);
  });
}
