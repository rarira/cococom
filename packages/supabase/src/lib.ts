/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PostgrestSingleResponse,
  SignInWithIdTokenCredentials,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  SupabaseClient,
  SupabaseClientOptions,
  createClient,
} from '@supabase/supabase-js';

import { Database } from './merged-types';

// import { loadEnv } from './util.js';

// loadEnv();

// // eslint-disable-next-line turbo/no-undeclared-env-vars
// const { SUPABASE_ANON_KEY, SUPABASE_ANON_KEY } = process.env;

// export const supabase = createClient<Database>(SUPABASE_ANON_KEY!, SUPABASE_ANON_KEY!);

export type InsertDiscount = Database['public']['Tables']['discounts']['Insert'];
export type InsertItem = Database['public']['Tables']['items']['Insert'];
export type InsertCategory = Database['public']['Tables']['categories']['Insert'];
export type InsertWishlist = Database['public']['Tables']['wishlists']['Insert'];
export type CategorySectors = Database['public']['Enums']['CategorySectors'];
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

  async upsertItem(item: InsertItem | InsertItem[]) {
    const response = await this.supabaseClient
      .from('items')
      .upsert(item as any, { ignoreDuplicates: true, onConflict: 'itemId' })
      .select();

    if (response.error) {
      console.error(response.error);
    }
    return response.data;
  }

  async upsertDiscount(discount: InsertDiscount | InsertDiscount[]) {
    const response = await this.supabaseClient
      .from('discounts')
      .upsert(discount as any, {
        ignoreDuplicates: true,
        onConflict: 'discountHash',
      })
      .select();

    if (response.error) {
      console.error(response.error);
    }
    return response.data;
  }

  async fetchAllItems() {
    const { data, error } = await this.supabaseClient.from('items').select('*');
    return data;
  }

  async fetchAllDiscounts() {
    const { data, error } = await this.supabaseClient.from('discounts').select('*');
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
    search: { value: string; column: string },
    tableName: T,
  ): Promise<PostgrestSingleResponse<Database['public']['Tables'][T]['Row']>> {
    return await this.supabaseClient
      .from(tableName)
      .select('*')
      .eq(search.column, search.value)
      .single();
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

  async signOut() {
    return await this.supabaseClient.auth.signOut();
  }
}
