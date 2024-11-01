import { Tables } from '@cococom/supabase/types';
import { SortOptionDirection } from '../../../../packages/supabase/dist/lib/lib';

export type SearchItemOptionInfo = {
  label: string;
  indicatorColor: string;
  iconColor: string;
};

export type SearchItemSortOption = {
  field: keyof Pick<Tables<'items'>, 'itemId' | 'itemName' | 'bestDiscountRate' | 'lowestPrice'>;
  orderBy: SortOptionDirection;
  text: string;
  authRequired?: boolean;
};
export const SEARCH_ITEM_SORT_OPTIONS: Record<string, SearchItemSortOption> = {
  itemNameAsc: {
    field: 'itemName',
    orderBy: 'ASC',
    text: '상품명 A-Z순',
  },
  itemNameDesc: {
    field: 'itemName',
    orderBy: 'DESC',
    text: '상품명 Z-A순',
  },
  itemIdDesc: {
    field: 'itemId',
    orderBy: 'DESC',
    text: '상품번호 높은 순',
  },
  itemIdAsc: {
    field: 'itemId',
    orderBy: 'ASC',
    text: '상품번호 낮은 순',
  },
  biggest: {
    field: 'bestDiscountRate',
    orderBy: 'DESC',
    text: '역대 최고 할인율 높은 순',
  },
  cheapset: {
    field: 'lowestPrice',
    orderBy: 'ASC',
    text: '역대 최저가 낮은 순',
  },
};
