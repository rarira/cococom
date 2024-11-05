import {
  CategorySectors,
  Database,
  JoinedItems,
  SortOptionDirection,
} from '@cococom/supabase/types';

import { DiscountListItemCardProps } from '@/components/custom/card/list-item/discount';

import { queryKeys } from '../react-query';

export type DiscountSortOption = {
  field:
    | keyof Database['public']['Functions']['get_discounts_with_wishlist_counts']['Returns'][0]
    | `items.${keyof JoinedItems}`;
  orderDirection: SortOptionDirection;
  text: string;
  authRequired?: boolean;
};

export const DISCOUNT_SORT_OPTIONS: Record<string, DiscountSortOption> = {
  biggest: {
    field: 'discountRate',
    orderDirection: 'DESC',
    text: '할인율 높은 순',
  },
  smallest: {
    field: 'discountRate',
    orderDirection: 'ASC',
    text: '할인율 낮은 순',
  },
  cheapset: {
    field: 'discountPrice',
    orderDirection: 'ASC',
    text: '할인가 낮은 순',
  },
  expensive: {
    field: 'discountPrice',
    orderDirection: 'DESC',
    text: '할인가 높은 순',
  },
  approaching: {
    field: 'endDate',
    orderDirection: 'ASC',
    text: '마감 임박 순',
  },
  newest: {
    field: 'startDate',
    orderDirection: 'DESC',
    text: '최신순',
  },
  popular: {
    field: 'items.totalWishlistCount',
    orderDirection: 'DESC',
    text: '인기순',
  },
  trend: {
    field: 'items.totalCommentCount',
    orderDirection: 'DESC',
    text: '댓글 많은 순',
  },
  frequent: {
    field: 'items.totalDiscountCount',
    orderDirection: 'DESC',
    text: '할인 빈도 많은 순',
  },
  rare: {
    field: 'items.totalDiscountCount',
    orderDirection: 'ASC',
    text: '할인 빈도 적은 순',
  },
};

export function sortDiscounts(
  sortOption: DiscountSortOption,
  data: DiscountListItemCardProps['discount'][],
) {
  return [...data].sort((a: Record<string, any>, b: Record<string, any>) => {
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
}

export function updateDiscountsByCategorySectorCache({
  userId,
  sortOption,
  queryClient,
  categorySector,
}: {
  userId?: string;
  sortOption: DiscountSortOption;
  queryClient: any;
  categorySector?: CategorySectors;
}) {
  const queryKey = queryKeys.discounts.currentList(userId, categorySector);

  queryClient.setQueryData(queryKey, (prevData: DiscountListItemCardProps['discount'][]) => {
    return sortDiscounts(sortOption, prevData);
  });
}
