import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '../merged-types';

export class ProfilesTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
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
}
