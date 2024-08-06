import data from '../data/discounts.js';
import { supabase } from '../libs/supabase.js';
import { loadEnv } from '../libs/util.js';

loadEnv();

const errors: unknown[] = [];

async function confirmDiscounts() {
  console.log(data.discounts.length);
  for (const [index, discount] of data.discounts.entries()) {
    const hashKey = `${discount.productcode}_${discount.startdate}_${discount.enddate}`;
    try {
      const data = await supabase.fetchData(
        {
          value: `${discount.productcode}_${discount.startdate}_${discount.enddate}`,
          column: 'discountHash',
        },
        'discounts',
      );
      console.log({ index, hashKey, data });
    } catch (error) {
      if (error) {
        errors.push(discount);
      }
      continue;
    }
  }
}

(async () => {
  await confirmDiscounts();
  console.log(errors);
})();
