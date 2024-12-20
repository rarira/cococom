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

export type JoinedMyComments = Omit<Tables<'comments'>, 'user_id' | 'item_id' | 'updated_at'> & {
  item: Pick<JoinedItems, 'id' | 'itemName' | 'itemId' | 'totalCommentCount'>;
};

export type JoinedMyMemos = Omit<Tables<'memos'>, 'user_id' | 'item_id' | 'created_at'> & {
  item: Pick<JoinedItems, 'id' | 'itemName' | 'itemId' | 'totalMemoCount'>;
};

export type InfiniteQueryResultPageArray =
  | { id: number }[]
  | InfinitResultPagesWithTotalRecords<{ id: number }>;

export type InfiniteQueryResult<T extends InfiniteQueryResultPageArray> = {
  pageParams: number[];
  pages: T[];
};

export type InfiniteResultItem = Omit<JoinedItems, 'discounts' | 'categories' | 'online_url'> & {
  isOnSaleNow: boolean;
};

export type AlltimeRankingResultItem = InfiniteResultItem & {
  created_at: string;
  totalDiscountCount: number;
};

export type InfinitResultPagesWithTotalRecords<T extends { id: number }> = {
  totalRecords: number | null;
  items: T[];
};

export type InfiniteItemsToRender<T extends { id: number }> = Array<
  T & {
    pageIndex: number;
  }
>;

export type InfiniteSearchResultPages = InfinitResultPagesWithTotalRecords<InfiniteResultItem>;

export type WishlistResultItem = Omit<InfiniteResultItem, 'isWishlistedByUser'> & {
  totalDiscountCount: number;
  wishlistCreatedAt: string;
  wishlistId: string;
  discount: Pick<
    Tables<'discounts'>,
    'discount' | 'discountPrice' | 'discountRate' | 'endDate'
  > | null;
};

export type InfiniteWishlistResultPages = InfinitResultPagesWithTotalRecords<WishlistResultItem>;

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
            _order_field: string;
            _order_direction: string;
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

export type InsertDiscount = Database['public']['Tables']['discounts']['Insert'];
export type InsertItem = Database['public']['Tables']['items']['Insert'];
export type InsertCategory = Database['public']['Tables']['categories']['Insert'];
export type InsertWishlist = Omit<
  Database['public']['Tables']['wishlists']['Insert'],
  'wishlist_hash'
>;
export type InsertHistory = Database['public']['Tables']['histories']['Insert'];
export type UpdateHistory = Database['public']['Tables']['histories']['Update'];
export type InsertMemo = Database['public']['Tables']['memos']['Insert'];
export type InsertComment = Database['public']['Tables']['comments']['Insert'];
export type CategorySectors = Database['public']['Enums']['CategorySectors'];
export type SortOptionDirection = 'ASC' | 'DESC';
