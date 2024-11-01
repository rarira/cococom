import { SupabaseClient } from '@supabase/supabase-js';

import { Database, InsertCategory } from '../merged-types';

export class CategoriesTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async upsertCategory(category: InsertCategory | InsertCategory[]) {
    return this.supabaseClient
      .from('categories')
      .upsert(category as InsertCategory[], { ignoreDuplicates: true, onConflict: 'id' });
  }
}
