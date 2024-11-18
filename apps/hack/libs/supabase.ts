/* eslint-disable turbo/no-undeclared-env-vars */
import { Supabase } from '@cococom/supabase/libs';
import { Tables } from '@cococom/supabase/types';

import { loadEnv } from './util.js';

loadEnv();

const supabaseUrl =
  process.env.NODE_ENV === 'PROD' ? process.env.SUPABASE_PROD_URL : process.env.SUPABASE_URL;

const supabaseAnonKey =
  process.env.NODE_ENV === 'PROD'
    ? process.env.SUPABASE_PROD_ANON_KEY
    : process.env.SUPABASE_ANON_KEY;

console.log({ supabaseUrl, supabaseAnonKey });

export const supabase = new Supabase(supabaseUrl!, supabaseAnonKey!);

export async function updateItemHistory(
  newlyAddedDiscounts: NonNullable<Awaited<ReturnType<typeof supabase.discounts.upsertDiscount>>>,
) {
  for (const newlyAddedDiscount of newlyAddedDiscounts) {
    try {
      const data = await supabase.fetchData(
        { value: newlyAddedDiscount.itemId, column: 'itemId' },
        'items',
      );
      if (!data) throw new Error('no data');

      const update: Partial<Tables<'items'>> = {
        bestDiscountRate: newlyAddedDiscount.discountRate,
        bestDiscount: newlyAddedDiscount.discount,
      };

      if (
        newlyAddedDiscount.discountRate &&
        data.bestDiscountRate &&
        newlyAddedDiscount.discountRate > data.bestDiscountRate
      ) {
        update.bestDiscountRate = newlyAddedDiscount.discountRate;
      }

      if (!data.lowestPrice || newlyAddedDiscount.discountPrice < data.lowestPrice) {
        update.lowestPrice = newlyAddedDiscount.discountPrice;
      }

      if (
        newlyAddedDiscount.discount &&
        data.bestDiscount &&
        data.bestDiscount < newlyAddedDiscount.discount
      ) {
        update.bestDiscount = newlyAddedDiscount.discount;
      }

      if (Object.keys(update).length === 0) continue;

      await supabase.items.updateItem(update, data.id);
    } catch (e) {
      console.error(e);
      continue;
    }
  }
}

export async function addReletedItemId(
  item: Pick<Tables<'items'>, 'itemId' | 'id'>,
  update: Partial<Tables<'items'>> = {},
) {
  try {
    const relatedItem = await supabase.fetchData(
      { column: 'itemId', value: item.itemId.split('_')[0]! },
      'items',
      'id',
    );

    await supabase.items.updateItem({ related_item_id: relatedItem.id, ...update }, item.id);
    await supabase.items.updateItem({ related_item_id: item.id }, relatedItem.id);
  } catch (error) {
    if (update) {
      await supabase.items.updateItem(update, item.id);
    }

    if (error.code === 'PGRST116') {
      return;
    } else {
      console.error('updateRelatedItemId error', error);
    }
  }
}

export async function getAllNoImagesFromHistory(date: string) {
  const { data: histories, error } = await supabase.supabaseClient
    .from('histories')
    .select('id, no_images')
    .eq('is_online', false)
    .gte('created_at', date);

  if (error) {
    console.error('getAllNoImagesFromHistory Error', error);
  }

  if (!histories) return [];

  console.log('histories', histories);

  return histories;
}

export async function updateNoImages(noImages: string[], id: number) {
  const { error } = await supabase.supabaseClient
    .from('histories')
    .update({ no_images: noImages })
    .eq('id', id);

  if (error) {
    console.error('updateNoImages Error', error);
  }
}
