import { JoinedMyComments } from '@cococom/supabase/types';
import { SortOptionDirection } from '../../../../packages/supabase/dist/lib/lib';

export type MyCommentSortOption = {
  field:
    | keyof JoinedMyComments
    | `item.${keyof Pick<JoinedMyComments['item'], 'itemName' | 'totalCommentCount'>}`;
  orderBy: SortOptionDirection;
  text: string;
};

export const MY_COMMENT_SORT_OPTIONS: Record<string, MyCommentSortOption> = {
  trend: {
    field: 'item.totalCommentCount',
    orderBy: 'DESC',
    text: '댓글 많은 순',
  },
  recent: {
    field: 'created_at',
    orderBy: 'DESC',
    text: '댓글 작성 최신 순',
  },
  old: {
    field: 'created_at',
    orderBy: 'ASC',
    text: '댓글 작성 오래된 순',
  },
  itemNameAsc: {
    field: 'item.itemName',
    orderBy: 'ASC',
    text: '상품명 A-Z순',
  },
  itemNameDesc: {
    field: 'item.itemName',
    orderBy: 'DESC',
    text: '상품명 Z-A순',
  },
};
