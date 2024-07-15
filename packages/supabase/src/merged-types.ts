import { MergeDeep } from 'type-fest';

import { Database as DatabaseGenerated, Json } from './types';

export { type Json } from './types';

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
                items: Json;
                totalWishlistCount: number;
                userWishlistCount: number;
              }[];
            }
          | {
              Args: {
                _current_time_stamp: string;
                _user_id?: string;
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
                items: Json;
                totalWishlistCount: number;
                userWishlistCount: number;
              }[];
            };
      };
    };
  }
>;
