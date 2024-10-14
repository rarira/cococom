/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SignInWithIdTokenCredentials,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  SupabaseClient,
  SupabaseClientOptions,
  createClient,
} from '@supabase/supabase-js';

import { Database, JoinedComments, Tables } from './merged-types';

// import { loadEnv } from './util.js';

// loadEnv();

// // eslint-disable-next-line turbo/no-undeclared-env-vars
// const { SUPABASE_ANON_KEY, SUPABASE_ANON_KEY } = process.env;

// export const supabase = createClient<Database>(SUPABASE_ANON_KEY!, SUPABASE_ANON_KEY!);

export type InsertDiscount = Database['public']['Tables']['discounts']['Insert'];
export type InsertItem = Database['public']['Tables']['items']['Insert'];
export type InsertCategory = Database['public']['Tables']['categories']['Insert'];
export type InsertWishlist = Database['public']['Tables']['wishlists']['Insert'];
export type InsertHistory = Database['public']['Tables']['histories']['Insert'];
export type InsertMemo = Database['public']['Tables']['memos']['Insert'];
export type InsertComment = Database['public']['Tables']['comments']['Insert'];
export type CategorySectors = Database['public']['Enums']['CategorySectors'];
export type SearchItemSortField = 'itemId' | 'itemName' | 'bestDiscountRate' | 'lowestPrice';
export type SearchItemSortDirection = 'ASC' | 'DESC';

export class Supabase {
  supabaseClient: SupabaseClient<Database>;

  constructor(
    supabaseUrl: string,
    supabaseAnonKey: string,
    options?: SupabaseClientOptions<'public'>,
  ) {
    this.supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, options);
  }

  // Query Methods
  async upsertCategory(category: InsertCategory | InsertCategory[]) {
    return this.supabaseClient
      .from('categories')
      .upsert(category as any, { ignoreDuplicates: true, onConflict: 'id' });
  }

  async upsertItem(
    item: InsertItem | InsertItem[],
    options?: { ignoreDuplicates?: boolean; onConflict?: string },
  ) {
    const response = await this.supabaseClient
      .from('items')
      .upsert(item as any, options || { ignoreDuplicates: true, onConflict: 'itemId' })
      .select('id, itemId');

    if (response.error) {
      console.error(response.error);
    }
    return response.data;
  }

  async upsertDiscount(
    discount: InsertDiscount | InsertDiscount[],
    options?: { ignoreDuplicates?: boolean; onConflict?: string },
  ) {
    const response = await this.supabaseClient
      .from('discounts')
      .upsert(
        discount as any,
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

  async fetchAllItems(noLowsetPrice?: boolean) {
    const call = this.supabaseClient.from('items').select('*');

    if (noLowsetPrice) {
      call.is('lowestPrice', null);
    }

    const { data, error } = await call;

    return data;
  }

  async fetchAllDiscounts() {
    const { data, error } = await this.supabaseClient.from('discounts').select('*');
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

  async updateItem(item: Database['public']['Tables']['items']['Update'], id: number) {
    const { error } = await this.supabaseClient.from('items').update(item).eq('id', id);
    return error;
  }

  async fetchData<T extends keyof Database['public']['Tables']>(
    search: { value: string | number; column: string },
    tableName: T,
    columns?: string,
  ): Promise<Tables<T>> {
    const { data, error } = await this.supabaseClient
      .from(tableName)
      .select(columns || '*')
      .eq(search.column, search.value)
      .single();

    if (error) {
      // console.error(error);
      throw error;
    }

    return data as Tables<T>;
  }

  async fetchDataLike<T extends keyof Database['public']['Tables']>(
    search: { value: string | number; column: string },
    tableName: T,
    columns?: string,
  ): Promise<Tables<T>[]> {
    const { data, error } = await this.supabaseClient
      .from(tableName)
      .select(columns || '*')
      .like(search.column, `${search.value}%`);

    if (error) {
      // console.error(error);
      throw error;
    }

    return data as Tables<T>[];
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

  async createWishlist(newWishlist: InsertWishlist) {
    const { error } = await this.supabaseClient.from('wishlists').insert(newWishlist);

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

  async insertHistory(newHistory: InsertHistory) {
    const { error } = await this.supabaseClient.from('histories').insert(newHistory);

    if (error) {
      console.log({ error });
      throw error;
    }
    console.log('inserted history');
  }

  async fetchLatestHistory() {
    const { data, error } = await this.supabaseClient.rpc('get_latest_histories');

    if (error) {
      console.log('fetchLatestHistory error', error);
      throw error;
    }

    return data;
  }

  async fullTextSearchItemsByKeyword(
    keyword: string,
    isOnsale: boolean,
    userId?: string,
    page = 1,
    pageSize = 20,
    sortField: SearchItemSortField = 'itemName',
    sortDirection: SearchItemSortDirection = 'ASC',
  ) {
    const { data, error } = await this.supabaseClient.rpc('search_items_by_keyword', {
      keyword,
      is_on_sale: isOnsale,
      user_id: userId ?? null,
      page,
      page_size: pageSize,
      order_field: sortField,
      order_direction: sortDirection,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  async fullTextSearchItemsByItemId(
    itemId: string,
    isOnsale: boolean,
    userId?: string,
    page = 1,
    pageSize = 20,
    sortField: SearchItemSortField = 'itemName',
    sortDirection: SearchItemSortDirection = 'ASC',
  ) {
    const { data, error } = await this.supabaseClient.rpc('search_items_by_itemid', {
      item_id: itemId,
      is_on_sale: isOnsale,
      user_id: userId ?? null,
      page,
      page_size: pageSize,
      order_field: sortField,
      order_direction: sortDirection,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
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

  async upsertMemo(memo: InsertMemo) {
    const { error } = await this.supabaseClient.from('memos').upsert(memo);

    if (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteMemo(memoId: number) {
    const { error } = await this.supabaseClient.from('memos').delete().eq('id', memoId);

    if (error) {
      console.error(error);
      throw error;
    }
  }

  async fetchMemos({
    itemId,
    userId,
    page,
    pageSize = 20,
  }: {
    itemId: number;
    userId: string;
    page: number;
    pageSize?: number;
  }) {
    const { data, error } = await this.supabaseClient
      .from('memos')
      .select('*')
      .eq('itemId', itemId)
      .eq('userId', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  async updateProfile(profile: Database['public']['Tables']['profiles']['Update'], userId: string) {
    const { data, error } = await this.supabaseClient
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  async fetchComments({
    itemId,
    page,
    pageSize = 20,
  }: {
    itemId: number;
    page: number;
    pageSize?: number;
  }) {
    const { data, error } = await this.supabaseClient
      .from('comments')
      .select('id, created_at, content, item_id, author:profiles (id, nickname)')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error(error);
      throw error;
    }

    return data as unknown as JoinedComments[];
  }

  async insertComment(comment: InsertComment) {
    const { error } = await this.supabaseClient.from('comments').insert(comment);

    if (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteComment(commentId: number) {
    const { error } = await this.supabaseClient.from('comments').delete().eq('id', commentId);

    if (error) {
      console.error(error);
      throw error;
    }
  }

  async fetchAlltimeRankingItems({
    userId,
    orderByColumn,
    orderByDirection,
    limitCount,
  }: {
    userId?: string;
    orderByColumn?: keyof Database['public']['Functions']['get_alltime_top_items']['Returns'][0];
    orderByDirection?: 'asc' | 'desc';
    limitCount?: number;
  }) {
    const { data, error } = await this.supabaseClient.rpc('get_alltime_top_items', {
      _user_id: userId ?? null,
      _order_by_column: orderByColumn,
      _order_by_direction: orderByDirection,
      _limit_count: limitCount,
    });

    if (error) {
      console.error('Error:', error);
      throw error;
    }

    return data;
  }

  // Auth Methods
  async signUpWithEmail(credentials: SignUpWithPasswordCredentials) {
    return await this.supabaseClient.auth.signUp(credentials);
  }

  async signInWithEmail(credentials: SignInWithPasswordCredentials) {
    return await this.supabaseClient.auth.signInWithPassword(credentials);
  }

  async signInWithIdToken(credentials: SignInWithIdTokenCredentials) {
    return await this.supabaseClient.auth.signInWithIdToken(credentials);
  }

  async verifyOtp(email: string, token: string) {
    return await this.supabaseClient.auth.verifyOtp({ email, token, type: 'recovery' });
  }

  async signOut() {
    return await this.supabaseClient.auth.signOut();
  }

  async deleteUser(userId: string) {
    const response = await this.supabaseClient.functions.invoke('delete-user', {
      body: { userId },
    });

    return response;
  }

  async changePassword(newPassword: string) {
    return await this.supabaseClient.auth.updateUser({
      password: newPassword,
    });
  }

  async resetPassword(email: string, redirectTo: string) {
    return await this.supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
  }
}
