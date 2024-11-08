import { SortOptionDirection, Tables } from '@cococom/supabase/types';

export type SearchItemOptionInfo = {
  label: string;
  indicatorColor: string;
  iconColor: string;
};

export type SearchItemSortOption = {
  field: keyof Pick<Tables<'items'>, 'itemId' | 'itemName' | 'bestDiscountRate' | 'lowestPrice'>;
  orderDirection: SortOptionDirection;
  text: string;
  authRequired?: boolean;
};
export const SEARCH_ITEM_SORT_OPTIONS: Record<string, SearchItemSortOption> = {
  itemNameAsc: {
    field: 'itemName',
    orderDirection: 'ASC',
    text: '상품명 A-Z순',
  },
  itemNameDesc: {
    field: 'itemName',
    orderDirection: 'DESC',
    text: '상품명 Z-A순',
  },
  itemIdDesc: {
    field: 'itemId',
    orderDirection: 'DESC',
    text: '상품번호 높은 순',
  },
  itemIdAsc: {
    field: 'itemId',
    orderDirection: 'ASC',
    text: '상품번호 낮은 순',
  },
  biggest: {
    field: 'bestDiscountRate',
    orderDirection: 'DESC',
    text: '역대 최고 할인율 높은 순',
  },
  cheapset: {
    field: 'lowestPrice',
    orderDirection: 'ASC',
    text: '역대 최저가 낮은 순',
  },
};
