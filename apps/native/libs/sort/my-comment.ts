import { JoinedMyComments, SortOptionDirection } from '@cococom/supabase/types';

export type MyCommentSortOption = {
  field:
    | keyof JoinedMyComments
    | `item.${keyof Pick<JoinedMyComments['item'], 'itemName' | 'totalCommentCount'>}`;
  orderDirection: SortOptionDirection;
  text: string;
};

export const MY_COMMENT_SORT_OPTIONS: Record<string, MyCommentSortOption> = {
  recent: {
    field: 'created_at',
    orderDirection: 'DESC',
    text: '댓글 작성 최신 순',
  },
  old: {
    field: 'created_at',
    orderDirection: 'ASC',
    text: '댓글 작성 오래된 순',
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
