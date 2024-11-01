import { SupabaseClient } from '@supabase/supabase-js';

import { Database, InsertItem, SortOptionDirection } from '../merged-types';

export class ItemsTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async upsertItem(
    item: InsertItem | InsertItem[],
    options?: { ignoreDuplicates?: boolean; onConflict?: string },
  ) {
    const response = await this.supabaseClient
      .from('items')
      .upsert(
        Array.isArray(item) ? item : [item],
        options || { ignoreDuplicates: true, onConflict: 'itemId' },
      )
      .select('id, itemId');

    if (response.error) {
      console.error(response.error);
    }
    return response.data;
  }

  async fetchAllItems(noLowsetPrice?: boolean) {
    const call = this.supabaseClient.from('items').select('*');

    if (noLowsetPrice) {
      call.is('lowestPrice', null);
    }

    const { data, error } = await call;

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  async updateItem(item: Database['public']['Tables']['items']['Update'], id: number) {
    const { error } = await this.supabaseClient.from('items').update(item).eq('id', id);
    return error;
  }

  async nullifyOnlineUrl() {
    const { data, error } = await this.supabaseClient
      .from('items')
      .update({ online_url: null })
      .neq('id', -1);

    if (error) {
      console.error('Error updating items:', error);
    } else {
      console.log('Updated items:', data);
    }
  }

  async fetchItemsWithWishlistCount(itemId: number, userId?: string, needDiscounts?: boolean) {
    const { data, error } = await this.supabaseClient.rpc('get_items_with_wishlist_counts_by_id', {
      item_id: itemId,
      user_id: userId ?? null,
      need_discounts: !!needDiscounts,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  async fetchOnlineItemsWithNullRelatedItem() {
    const { data, error } = await this.supabaseClient
      .from('items')
      .select('id, itemId')
      .eq('is_online', true)
      .is('related_item_id', null)
      .limit(2000);

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  async fetchAlltimeRankingItems({
    channel,
    userId,
    orderByColumn,
    orderByDirection,
    limitCount,
  }: {
    channel: string;
    userId?: string;
    orderByColumn?: keyof Database['public']['Functions']['get_alltime_top_items']['Returns'][0];
    orderByDirection?: SortOptionDirection;
    limitCount?: number;
  }) {
    const { data, error } = await this.supabaseClient.rpc('get_alltime_top_items', {
      _channel: channel,
      _user_id: userId ?? null,
      _order_by_column: orderByColumn ?? 'created_at',
      _order_by_direction: orderByDirection ?? 'DESC',
      _limit_count: limitCount ?? 50,
    });

    if (error) {
      console.error('Error:', error);
      throw error;
    }

    return data;
  }

  // Search
  async fullTextSearchItemsByKeyword({
    channelOption,
    keyword,
    isOnsale,
    userId,
    page = 1,
    pageSize = 20,
    sortField = 'itemName',
    sortDirection = 'ASC',
  }: {
    channelOption: string;
    keyword: string;
    isOnsale: boolean;
    userId?: string;
    page?: number;
    pageSize?: number;
    sortField: string;
    sortDirection: SortOptionDirection;
  }) {
    const { data, error } = await this.supabaseClient.rpc('search_items_by_keyword', {
      keyword,
      is_on_sale: isOnsale,
      user_id: userId ?? null,
      page,
      page_size: pageSize,
      order_field: sortField,
      order_direction: sortDirection,
      channel: channelOption,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  async fullTextSearchItemsByItemId({
    channelOption,
    itemId,
    isOnsale,
    userId,
    page = 1,
    pageSize = 20,
    sortField = 'itemName',
    sortDirection = 'ASC',
  }: {
    channelOption: string;
    itemId: string;
    isOnsale: boolean;
    userId?: string;
    page: number;
    pageSize: number;
    sortField: string;
    sortDirection: SortOptionDirection;
  }) {
    const { data, error } = await this.supabaseClient.rpc('search_items_by_itemid', {
      item_id: itemId,
      is_on_sale: isOnsale,
      user_id: userId ?? null,
      page,
      page_size: pageSize,
      order_field: sortField,
      order_direction: sortDirection,
      channel: channelOption,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }
}
