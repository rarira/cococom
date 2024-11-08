import { SortOptionDirection, WishlistResultItem } from '@cococom/supabase/types';

export type WishlistSortOption = {
  field: keyof WishlistResultItem | 'endDate';
  orderDirection: SortOptionDirection;
  text: string;
};

export const WISHLIST_SORT_OPTIONS: Record<string, WishlistSortOption> = {
  recent: {
    field: 'wishlistCreatedAt',
    orderDirection: 'DESC',
    text: '관심 등록 최신 순',
  },
  old: {
    field: 'wishlistCreatedAt',
    orderDirection: 'ASC',
    text: '관심 등록 오래된 순',
  },
  itemIdAsc: {
    field: 'itemId',
    orderDirection: 'ASC',
    text: '상품번호 낮은 순',
  },
  itemIdDesc: {
    field: 'itemId',
    orderDirection: 'DESC',
    text: '상품번호 높은 순',
  },
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
  popular: {
    field: 'totalWishlistCount',
    orderDirection: 'DESC',
    text: '인기순',
  },
  trend: {
    field: 'totalCommentCount',
    orderDirection: 'DESC',
    text: '댓글 많은 순',
  },
  rare: {
    field: 'totalDiscountCount',
    orderDirection: 'ASC',
    text: '할인 빈도 적은 순',
  },
  approaching: {
    field: 'endDate',
    orderDirection: 'ASC',
    text: '할인 마감 임박 순',
  },
};
