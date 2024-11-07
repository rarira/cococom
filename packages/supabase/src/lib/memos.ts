import { SupabaseClient } from '@supabase/supabase-js';

import { Database, InsertMemo, JoinedMyMemos, SortOptionDirection } from '../merged-types';

export class MemosTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async upsertMemo(memo: InsertMemo) {
    const { data, error } = await this.supabaseClient
      .from('memos')
      .upsert(memo)
      .select('id,created_at,updated_at,item:items (id, itemId, itemName, is_online)');

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
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
    pageSize,
  }: {
    itemId: number;
    userId: string;
    page: number;
    pageSize: number;
  }) {
    const { data, error } = await this.supabaseClient
      .from('memos')
      .select('*')
      .eq('itemId', itemId)
      .eq('userId', userId)
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  async fetchMyMemos({
    userId,
    page,
    pageSize = 20,
    orderBy = 'created_at',
    orderDirection = 'DESC',
  }: {
    userId: string;
    page: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: SortOptionDirection;
  }) {
    let promise = this.supabaseClient
      .from('memos')
      .select('id, created_at, updated_at, content, item:items (id, itemName, itemId)')
      .eq('userId', userId);

    if (orderBy?.startsWith('item.')) {
      promise = promise.order(`item(${orderBy.split('.')[1]})`, {
        ascending: orderDirection !== 'DESC',
      });
    } else {
      promise = promise.order(orderBy, { ascending: orderDirection !== 'DESC' });
    }

    const { data, error } = await promise.range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error(error);
      throw error;
    }

    return data as unknown as JoinedMyMemos[];
  }
}
