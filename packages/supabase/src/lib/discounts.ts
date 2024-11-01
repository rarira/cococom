import { SupabaseClient } from '@supabase/supabase-js';

import { CategorySectors, Database, InsertDiscount, SortOptionDirection } from '../merged-types';

export class DiscountsTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async upsertDiscount(
    discount: InsertDiscount | InsertDiscount[],
    options?: { ignoreDuplicates?: boolean; onConflict?: string },
  ) {
    const response = await this.supabaseClient
      .from('discounts')
      .upsert(
        Array.isArray(discount) ? discount : [discount],
        options || {
          ignoreDuplicates: true,
          onConflict: 'discountHash',
        },
      )
      .select('discountRate, discount, itemId, discountPrice');

    if (response.error) {
      console.error(response.error);
    }
    return response.data;
  }

  async fetchAllDiscounts() {
    const { data, error } = await this.supabaseClient.from('discounts').select('*');

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  async fetchCurrentOnlineDiscounts(currentTimestamp: string) {
    const { data, error } = await this.supabaseClient
      .from('discounts')
      .select('id, itemId, discountHash, startDate, discount, discountPrice, price')
      .eq('is_online', true)
      .lte('startDate', currentTimestamp)
      .gte('endDate', currentTimestamp);

    if (error) {
      throw error;
    }

    return data;
  }

  async fetchCurrentDiscountsByCategorySector(currentTimestamp: string) {
    const { data, error } = await this.supabaseClient.rpc(
      'get_current_discounts_by_category_sector',
      {
        _current_time_stamp: currentTimestamp,
      },
    );

    if (error) {
      throw error;
    }

    return data;
  }

  async fetchCurrentDiscountsWithWishlistCount({
    currentTimestamp,
    userId,
    categorySector,
  }: {
    currentTimestamp: string;
    userId?: string;
    categorySector?: CategorySectors;
  }) {
    const { data, error } = await this.supabaseClient.rpc('get_discounts_with_wishlist_counts', {
      _current_time_stamp: currentTimestamp!,
      _user_id: userId ?? null,
      _category_sector: categorySector ?? null,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async fetchCurrentDiscountedRankingWithWishlistCount({
    currentTimestamp,
    userId,
    channel,
    limit,
    sortField = 'discoutRate',
    sortDirection = 'DESC',
  }: {
    currentTimestamp: string;
    userId?: string;
    channel: string;
    limit: number;
    sortField: string;
    sortDirection: SortOptionDirection;
  }) {
    const { data, error } = await this.supabaseClient.rpc(
      'get_discounted_ranking_with_wishlist_counts',
      {
        _current_time_stamp: currentTimestamp!,
        _user_id: userId ?? null,
        _channel: channel,
        _limit: limit,
        _order_field: sortField,
        _order_direction: sortDirection,
      },
    );

    if (error) {
      throw error;
    }

    return data;
  }
}
