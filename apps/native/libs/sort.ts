import { CategorySectors } from '@cococom/supabase/libs';
import { Database, JoinedItems } from '@cococom/supabase/types';

import { DiscountListItemCardProps } from '@/components/custom/card/list-item/discount';

import { queryKeys } from './react-query';
import { SearchItemSortOption } from './search';

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
  data: DiscountListItemCardProps['discount'][],
) {
  return [...data].sort(
    (a: DiscountListItemCardProps['discount'], b: DiscountListItemCardProps['discount']) => {
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
    },
  );
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

  queryClient.setQueryData(queryKey, (prevData: DiscountListItemCardProps['discount'][]) => {
    return sortDiscountsByCategorySector(sortKey, prevData);
  });
}

export const ITEM_SORT_OPTIONS: Record<string, SearchItemSortOption> = {
  itemNameAsc: {
    field: 'itemName',
    direction: 'ASC',
    text: '상품명 A-Z순',
  },
  itemNameDesc: {
    field: 'itemName',
    direction: 'DESC',
    text: '상품명 Z-A순',
  },
  itemIdDesc: {
    field: 'itemId',
    direction: 'DESC',
    text: '상품번호 높은 순',
  },
  itemIdAsc: {
    field: 'itemId',
    direction: 'ASC',
    text: '상품번호 낮은 순',
  },
  biggest: {
    field: 'bestDiscountRate',
    direction: 'DESC',
    text: '역대 최고 할인율 높은 순',
  },
  cheapset: {
    field: 'lowestPrice',
    direction: 'ASC',
    text: '역대 최저가 낮은 순',
  },
};