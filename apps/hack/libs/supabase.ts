import { Supabase } from '@cococom/supabase/libs';
import { Tables } from '@cococom/supabase/types';

import { loadEnv } from './util.js';

loadEnv();

export const supabase = new Supabase(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function updateItemHistory(
  newlyAddedDiscounts: NonNullable<Awaited<ReturnType<typeof supabase.upsertDiscount>>>,
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

      await supabase.updateItem(update, data.id);
    } catch (e) {
      console.error(e);
      continue;
    }
  }
}
