import { SupabaseClient } from '@supabase/supabase-js';

import { Database, InsertMemo } from '../merged-types';

export class MemosTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async upsertMemo(memo: InsertMemo) {
    const { data, error } = await this.supabaseClient.from('memos').upsert(memo).select('id');

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
}
