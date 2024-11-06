import { JoinedMyMemos, SortOptionDirection } from '@cococom/supabase/types';

export type MyMemoSortOption = {
  field: keyof JoinedMyMemos | `item.${keyof Pick<JoinedMyMemos['item'], 'itemName'>}`;
  orderDirection: SortOptionDirection;
  text: string;
};

export const MY_MEMO_SORT_OPTIONS: Record<string, MyMemoSortOption> = {
  recent: {
    field: 'updated_at',
    orderDirection: 'DESC',
    text: '메모 작성/수정 최신 순',
  },
  old: {
    field: 'updated_at',
    orderDirection: 'ASC',
    text: '메모 작성/수정 오래된 순',
  },
  itemNameAsc: {
    field: 'item.itemName',
    orderDirection: 'ASC',
    text: '상품명 A-Z순',
  },
  itemNameDesc: {
    field: 'item.itemName',
    orderDirection: 'DESC',
    text: '상품명 Z-A순',
  },
};
