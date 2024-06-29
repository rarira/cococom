import { createClient } from '@supabase/supabase-js';

import { Database } from './types.js';
import { loadEnv } from './util.js';

loadEnv();

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

const supabase = createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!);

type InsertDiscount = Database['public']['Tables']['discounts']['Insert'];
type InsertItem = Database['public']['Tables']['items']['Insert'];
type insertCategory = Database['public']['Tables']['categories']['Insert'];

export function upsertCategory(category: insertCategory | insertCategory[]) {
  return supabase
    .from('categories')
    .upsert(category as any, { ignoreDuplicates: true, onConflict: 'id' });
}

export async function upsertItem(item: InsertItem | InsertItem[]) {
  const response = await supabase
    .from('items')
    .upsert(item as any, { ignoreDuplicates: true, onConflict: 'itemId' })
    .select();

  if (response.error) {
    console.error(response.error);
  }
  return response.data;
}

export async function upsertDiscount(discount: InsertDiscount | InsertDiscount[]) {
  const response = await supabase
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

export async function fetchAllItems() {
  const { data, error } = await supabase.from('items').select('*');
  return data;
}

export async function fetchAllDiscounts() {
  const { data, error } = await supabase.from('discounts').select('*');
  return data;
}

export async function updateItem(
  item: Database['public']['Tables']['items']['Update'],
  id: number,
) {
  const { error } = await supabase.from('items').update(item).eq('id', id);
}

export async function fetchData<T extends keyof Database['public']['Tables']>(
  search: { value: string; column: string },
  tableName: T,
) {
  const response = await supabase.from(tableName).select('*').eq(search.column, search.value);
  return response;
}
