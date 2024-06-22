import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

type InsertDiscount = Database['public']['Tables']['discounts']['Insert'];
type InsertItem = Database['public']['Tables']['items']['Insert'];
type insertCategory = Database['public']['Tables']['categories']['Insert'];

export function upsertCategory(category: insertCategory | insertCategory[]) {
  return supabase.from('categories').upsert(category as any, { ignoreDuplicates: true });
}

export async function upsertItem(item: InsertItem | InsertItem[]) {
  const { data, error } = await supabase
    .from('items')
    .upsert(item as any, { ignoreDuplicates: true })
    .select();

  return data;
}

export async function upsertDiscount(discount: InsertDiscount | InsertDiscount[]) {
  const { data, error } = await supabase
    .from('discounts')
    .upsert(discount as any, { ignoreDuplicates: true })
    .select();

  return data;
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
