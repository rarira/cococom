import { MergeDeep } from 'type-fest';

import { Database as DatabaseGenerated, Tables } from './types';

export type { Session, User } from '@supabase/supabase-js';

export type { Enums, Json, Tables, TablesInsert, TablesUpdate } from './types';

export type JoinedItems = Tables<'items'> & {
  categories: Tables<'categories'>;
  discounts?: Array<Tables<'discounts'>> | null;
  totalDiscountCount: number;
  totalWishlistCount: number;
  totalCommentCount: number;
  totalMemoCount: number | null;
  isWishlistedByUser: boolean;
};

export type JoinedComments = Omit<Tables<'comments'>, 'user_id'> & {
  author: Pick<Tables<'profiles'>, 'id' | 'nickname'>;
};

export type InfiniteQueryResult<T> = {
  pageParams: number[];
  pages: T[];
};

export type InfiniteSearchResultItem = {
  id: number;
  itemId: string;
  itemName: string;
  bestDiscountRate: number;
  bestDiscount: number;
  lowestPrice: number;
  isOnSaleNow: boolean;
  totalWishlistCount: number;
  totalCommentCount: number;
  totalMemoCount: number | null;
  isWishlistedByUser: boolean;
  is_online: boolean;
};

export type AlltimeRankingResultItem = InfiniteSearchResultItem & {
  created_at: string;
  totalDiscountCount: number;
};

export type InfiniteSearchResultPages = {
  totalRecords: number | null;
  items: InfiniteSearchResultItem[];
};

export type WishlistResultItem = Omit<InfiniteSearchResultItem, 'isWishlistedByUser'> & {
  totalDiscountCount: number;
  wishlistCreatedAt: string;
  discount: Pick<
    Tables<'discounts'>,
    'discount' | 'discountPrice' | 'discountRate' | 'endDate'
  > | null;
};

export type InfiniteWishlistResultPages = {
  totalRecords: number | null;
  items: WishlistResultItem[];
};

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Functions: {
        get_discounts_with_wishlist_counts: {
          Args: {
            _current_time_stamp: string;
            _user_id: string | null;
            _category_sector: Database['public']['Enums']['CategorySectors'] | null;
          };
          Returns: {
            id: number;
            startDate: string;
            endDate: string;
            price: number;
            discountPrice: number;
            discountRate: number;
            discount: number;
            is_online: boolean;
            items: Omit<JoinedItems, 'discounts'>;
          }[];
        };
        get_discounted_ranking_with_wishlist_counts: {
          Args: {
            _current_time_stamp: string;
            _user_id: string | null;
            _channel: string;
            _limit: number;
          };
          Returns: {
            id: number;
            startDate: string;
            endDate: string;
            price: number;
            discountPrice: number;
            discountRate: number;
            discount: number;
            is_online: boolean;
            items: Omit<JoinedItems, 'discounts'>;
          }[];
        };
        search_items_by_itemid: {
          Args: {
            item_id: string;
            is_on_sale: boolean;
            user_id: string | null;
            page: number;
            page_size: number;
            order_field: string;
            order_direction: string;
          };
          Returns: InfiniteSearchResultPages;
        };
        search_items_by_keyword: {
          Args: {
            keyword: string;
            is_on_sale: boolean;
            user_id: string | null;
            page: number;
            page_size: number;
            order_field: string;
            order_direction: string;
          };
          Returns: InfiniteSearchResultPages;
        };
        get_items_with_wishlist_counts_by_id: {
          Args: {
            item_id: number;
            user_id: string | null;
            need_discounts: boolean;
          };
          Returns: JoinedItems;
        };
        get_alltime_top_items: {
          Args: {
            _channel: string;
            _user_id: string | null;
            _order_by_column?: string;
            _order_by_direction?: string;
            _limit_count?: number;
          };
          Returns: AlltimeRankingResultItem[];
        };
        get_wishlist_items: {
          Args: {
            user_id: string;
            is_on_sale: boolean | null;
            page: number;
            page_size: number;
            order_field: string;
            order_direction: string;
            channel: string;
          };
          Returns: InfiniteWishlistResultPages;
        };
      };
    };
  }
>;
