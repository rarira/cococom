import { SupabaseClient } from '@supabase/supabase-js';

import { Database, InsertHistory, UpdateHistory } from '../merged-types';

export class HistoriesTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async insertHistory(newHistory: InsertHistory) {
    const { data, error } = await this.supabaseClient
      .from('histories')
      .insert(newHistory)
      .select('id');

    if (error) {
      console.error({ error });
      throw error;
    }
    console.log('inserted history with id', data?.[0]?.id);

    return data[0];
  }

  async updateHistory(newHistory: UpdateHistory) {
    if (!newHistory.id) {
      throw new Error('id is required to update history');
    }
    const { error } = await this.supabaseClient
      .from('histories')
      .update(newHistory)
      .eq('id', newHistory.id);

    if (error) {
      console.error({ error });
      throw error;
    }
  }

  async fetchLatestHistory() {
    const { data, error } = await this.supabaseClient.rpc('get_latest_histories');

    if (error) {
      console.log('fetchLatestHistory error', error);
      throw error;
    }

    return data;
  }

  async deleteHistory(id: number) {
    const { error } = await this.supabaseClient.from('histories').delete().eq('id', id);

    if (error) {
      console.log('deleteHistory error', error);
      throw error;
    }

    console.log('deleted history with id', id);

    // const { error: rpcCallError } = await this.supabaseClient.rpc('restart_table_sequence', {
    //   table_name: 'histories',
    //   new_value: id,
    // });

    // if (rpcCallError) {
    //   console.log('deleteHistory rpcCallError', rpcCallError);
    //   throw rpcCallError;
    // }
  }
}
