import { SupabaseClient } from '@supabase/supabase-js';

import { Database, InsertWishlist, SortOptionDirection } from '../merged-types';

export class WishlistsTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async createWishlist(newWishlist: Omit<InsertWishlist, 'wishlist_hash'>) {
    const { error } = await this.supabaseClient
      .from('wishlists')
      .insert({ ...newWishlist, wishlist_hash: newWishlist.itemId + newWishlist.userId });

    if (error) {
      throw error;
    }

    return;
  }

  async deleteWishlist(deleteWishlist: Required<Pick<InsertWishlist, 'itemId' | 'userId'>>) {
    const { error } = await this.supabaseClient
      .from('wishlists')
      .delete()
      .eq('itemId', deleteWishlist.itemId)
      .eq('userId', deleteWishlist.userId);

    if (error) {
      throw error;
    }

    return;
  }

  async deleteWishlistById(wishlistId: string) {
    const { error } = await this.supabaseClient.from('wishlists').delete().eq('id', wishlistId);
    if (error) {
      throw error;
    }

    return;
  }

  async fetchMyWishlistItems({
    userId,
    channel,
    sortField = 'itemId',
    sortDirection = 'ASC',
    page,
    pageSize,
    isOnSale,
  }: {
    userId: string;
    channel: string;
    sortField: string;
    sortDirection: SortOptionDirection;
    page: number;
    pageSize: number;
    isOnSale?: boolean;
  }) {
    const { data, error } = await this.supabaseClient
      .rpc('get_wishlist_items', {
        user_id: userId,
        channel,
        page,
        page_size: pageSize,
        order_field: sortField,
        order_direction: sortDirection,
        is_on_sale: typeof isOnSale === 'boolean' ? isOnSale : null,
      })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error('Error:', error);
      throw error;
    }

    return data;
  }

  async getMyWishlistItemsCount({ userId }: { userId: string }) {
    const { data, error } = await this.supabaseClient
      .from('wishlists')
      .select('id', { count: 'estimated', head: true })
      .eq('userId', userId);

    if (error) {
      console.error('Error:', error);
      throw error;
    }

    return data;
  }
}
