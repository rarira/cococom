import data from '../data/discounts.js';
import { supabase } from '../libs/supabase.js';
import { loadEnv } from '../libs/util.js';

loadEnv();

const errors = [];

async function confirmDiscounts() {
  console.log(data.discounts.length);
  for (const [index, discount] of data.discounts.entries()) {
    const hashKey = `${discount.productcode}_${discount.startdate}_${discount.enddate}`;
    const response = await supabase.fetchData(
      {
        value: `${discount.productcode}_${discount.startdate}_${discount.enddate}`,
        column: 'discountHash',
      },
      'discounts',
    );
    if (response.error || response.data.length === 0) {
      errors.push(discount);
    }
    console.log({ index, hashKey, response: response.data.length });
  }
}

(async () => {
  await confirmDiscounts();
  console.log(errors);
})();
