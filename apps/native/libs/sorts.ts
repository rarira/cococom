import { Database, JoinedItems } from '@cococom/supabase/types';

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
