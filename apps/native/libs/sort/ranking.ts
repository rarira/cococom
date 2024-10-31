import { SortOptionDirection } from '@cococom/supabase/libs';
import { AlltimeRankingResultItem } from '@cococom/supabase/types';

import { DiscountSortOption } from './discount';

export type AlltimeSortOption = {
  field: keyof AlltimeRankingResultItem;
  orderBy: SortOptionDirection;
  text: string;
  authRequired?: boolean;
};
export const DISCOUNTED_RANKING_SORT_OPTIONS: Record<string, DiscountSortOption> = {
  biggest: {
    field: 'discountRate',
    orderBy: 'DESC',
    text: '할인율 높은 순',
  },
  cheapset: {
    field: 'discountPrice',
    orderBy: 'ASC',
    text: '할인가 낮은 순',
  },
  approaching: {
    field: 'endDate',
    orderBy: 'ASC',
    text: '마감 임박 순',
  },
  popular: {
    field: 'items.totalWishlistCount',
    orderBy: 'DESC',
    text: '인기순',
  },
  trend: {
    field: 'items.totalCommentCount',
    orderBy: 'DESC',
    text: '댓글 많은 순',
  },
  rare: {
    field: 'items.totalDiscountCount',
    orderBy: 'ASC',
    text: '할인 빈도 적은 순',
  },
};

export const ALLTIME_RANKING_SORT_OPTIONS: Record<string, AlltimeSortOption> = {
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
  memorable: {
    field: 'totalMemoCount',
    orderBy: 'DESC',
    text: '메모 많은 순',
    authRequired: true,
  },
  rare: {
    field: 'totalDiscountCount',
    orderBy: 'DESC',
    text: '할인 빈도 많은 순',
  },
};
