import { SortOptionDirection } from '@cococom/supabase/libs';
import { WishlistResultItem } from '@cococom/supabase/types';

export type WishlistSortOption = {
  field: keyof WishlistResultItem | 'endDate';
  orderBy: SortOptionDirection;
  text: string;
};

export const WISHLIST_SORT_OPTIONS: Record<string, WishlistSortOption> = {
  recent: {
    field: 'wishlistCreatedAt',
    orderBy: 'DESC',
    text: '관심 등록 최신 순',
  },
  old: {
    field: 'wishlistCreatedAt',
    orderBy: 'ASC',
    text: '관심 등록 오래된 순',
  },
  itemIdAsc: {
    field: 'itemId',
    orderBy: 'ASC',
    text: '상품번호 낮은 순',
  },
  itemIdDesc: {
    field: 'itemId',
    orderBy: 'DESC',
    text: '상품번호 높은 순',
  },
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
  popular: {
    field: 'totalWishlistCount',
    orderBy: 'DESC',
    text: '인기순',
  },
  trend: {
    field: 'totalCommentCount',
    orderBy: 'DESC',
    text: '댓글 많은 순',
  },
  rare: {
    field: 'totalDiscountCount',
    orderBy: 'ASC',
    text: '할인 빈도 적은 순',
  },
  approaching: {
    field: 'endDate',
    orderBy: 'ASC',
    text: '할인 마감 임박 순',
  },
};
