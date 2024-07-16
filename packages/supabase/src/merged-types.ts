import { MergeDeep } from 'type-fest';

import { Database as DatabaseGenerated, Tables } from './types';

export { type Json } from './types';

export type JoinedItems = Tables<'items'> & {
  categories: Tables<'categories'>;
  discounts: Array<Tables<'discounts'>>;
};
// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Functions: {
        get_discounts_with_wishlist_counts:
          | {
              Args: Record<PropertyKey, never>;
              Returns: {
                id: number;
                itemId: string;
                startDate: string;
                endDate: string;
                price: number;
                discount: number;
                discountPrice: number;
                discountHash: string;
                discountRate: number;
                items: JoinedItems;
                totalWishlistCount: number;
                userWishlistCount: number;
              }[];
            }
          | {
              Args: {
                _current_time_stamp: string;
                _user_id: string | null;
              };
              Returns: {
                id: number;
                itemId: string;
                startDate: string;
                endDate: string;
                price: number;
                discount: number;
                discountPrice: number;
                discountHash: string;
                discountRate: number;
                items: JoinedItems;
                totalWishlistCount: number;
                userWishlistCount: number;
              }[];
            };
      };
    };
  }
>;
