/* eslint-disable @typescript-eslint/no-explicit-any */

import { SupabaseClient, SupabaseClientOptions, createClient } from '@supabase/supabase-js';

import { Database, Tables } from '../merged-types';
import { AuthTable } from './auth';
import { CategoriesTable } from './categories';
import { CommentsTable } from './comments';
import { DiscountsTable } from './discounts';
import { HistoriesTable } from './histories';
import { ItemsTable } from './items';
import { MemosTable } from './memos';
import { ProfilesTable } from './profiles';
import { WishlistsTable } from './wishlists';

export class Supabase {
  supabaseClient: SupabaseClient<Database>;

  public items: ItemsTable;
  public wishlists: WishlistsTable;
  public auth: AuthTable;
  public discounts: DiscountsTable;
  public comments: CommentsTable;
  public categories: CategoriesTable;
  public histories: HistoriesTable;
  public memos: MemosTable;
  public profiles: ProfilesTable;

  constructor(
    supabaseUrl: string,
    supabaseAnonKey: string,
    options?: SupabaseClientOptions<'public'>,
  ) {
    this.supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, options);

    // 각 테이블 클래스 초기화
    this.items = new ItemsTable(this.supabaseClient);
    this.wishlists = new WishlistsTable(this.supabaseClient);
    this.auth = new AuthTable(this.supabaseClient);
    this.discounts = new DiscountsTable(this.supabaseClient);
    this.comments = new CommentsTable(this.supabaseClient);
    this.categories = new CategoriesTable(this.supabaseClient);
    this.histories = new HistoriesTable(this.supabaseClient);
    this.memos = new MemosTable(this.supabaseClient);
    this.profiles = new ProfilesTable(this.supabaseClient);
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
}
