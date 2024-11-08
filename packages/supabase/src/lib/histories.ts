import { SupabaseClient } from '@supabase/supabase-js';

import { Database, InsertHistory } from '../merged-types';

export class HistoriesTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async insertHistory(newHistory: InsertHistory) {
    const { error } = await this.supabaseClient.from('histories').insert(newHistory);

    if (error) {
      console.error({ error });
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
}
