import { MergeDeep } from 'type-fest';

import { Database as DatabaseGenerated, Tables } from './types';

export type { Session, User } from '@supabase/supabase-js';

export type { Enums, Json, Tables, TablesInsert, TablesUpdate } from './types';

export type JoinedItems = Tables<'items'> & {
  categories: Tables<'categories'>;
  discounts: Array<Tables<'discounts'>> | null;
  discountsLength: number;
  totalWishlistCount: number;
  isWishlistedByUser: boolean;
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
            items: JoinedItems;
          }[];
        };
      };
    };
  }
>;
