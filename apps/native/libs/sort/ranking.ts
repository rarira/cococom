import { AlltimeRankingResultItem, SortOptionDirection } from '@cococom/supabase/types';

import { DiscountSortOption } from './discount';

export type AlltimeSortOption = {
  field: keyof AlltimeRankingResultItem;
  orderDirection: SortOptionDirection;
  text: string;
  authRequired?: boolean;
};
export const DISCOUNTED_RANKING_SORT_OPTIONS: Record<string, DiscountSortOption> = {
  biggest: {
    field: 'discountRate',
    orderDirection: 'DESC',
    text: '할인율 높은 순',
  },
  cheapset: {
    field: 'discountPrice',
    orderDirection: 'ASC',
    text: '할인가 낮은 순',
  },
  approaching: {
    field: 'endDate',
    orderDirection: 'ASC',
    text: '마감 임박 순',
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
  rare: {
    field: 'items.totalDiscountCount',
    orderDirection: 'ASC',
    text: '할인 빈도 적은 순',
  },
};

export const ALLTIME_RANKING_SORT_OPTIONS: Record<string, AlltimeSortOption> = {
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
  memorable: {
    field: 'totalMemoCount',
    orderDirection: 'DESC',
    text: '메모 많은 순',
    authRequired: true,
  },
  rare: {
    field: 'totalDiscountCount',
    orderDirection: 'DESC',
    text: '할인 빈도 많은 순',
  },
};
