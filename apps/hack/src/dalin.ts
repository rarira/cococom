// eslint-disable-next-line import/order
import { loadEnv } from '../libs/util.js';

import axios from 'axios';

import { supabase } from '../libs/supabase.js';

loadEnv();

function makeDbData({ like_cnt, share_cnt, ...restData }: any) {
  return {
    ...restData,
    hash: `${restData.product_id}@${restData.from_date}-${restData.to_date}$${restData.discount}`,
  };
}

async function getAllDiscountsByItem() {
  const productIdArray = [];
  let addedDiscountCount = 0;

  const idArray = new Array<number>(100000)
    .fill(0)
    .map((_, i) => {
      if (i <= 3286) return null;
      return i;
    })
    .filter(Boolean);

  for (const id of idArray) {
    // if (id !== 5402) continue;
    // console.log(`${process.env['2ND_API_URL']}/productView/${id}`);

    const { data } = await axios.get(`${process.env['2ND_API_URL']}/productView/${id}`);

    if (!data || data.length === 0) continue;

    const newData = data.map(makeDbData);

    const { error } = await supabase.supabaseClient.from('dalins').insert(newData);

    if (error) {
      console.error(id, error);
      break;
    } else {
      productIdArray.push(id);
      addedDiscountCount += data.length;
      //   console.log(`Inserted ${id}: data.length=${data.length}`);
    }
  }

  console.log('--- getAllDiscountsByItem ---');

  console.log(
    'productIdArrayLength:',
    productIdArray.length,
    'lastProductId:',
    productIdArray[productIdArray.length - 1],
  );
  console.log('addedDiscountCount:', addedDiscountCount);
}

async function getAllDiscountsByCategory() {
  const categorySet = new Set<number>();
  let addedDiscountCount = 0;

  const idArray = new Array<number>(20)
    .fill(0)
    .map((_, i) => {
      // if (i <= 3286) return null;
      return i;
    })
    .filter(Boolean);

  for (const id of idArray) {
    // if (id !== 5402) continue;
    // console.log(`${process.env['2ND_API_URL']}/productView/${id}`);

    // eslint-disable-next-line turbo/no-undeclared-env-vars
    const { data } = await axios.get(`${process.env['2ND_API_URL']}/productList/${id}`);

    if (!data || data.length === 0) continue;

    const newData = data.map(makeDbData);

    for (const item of newData) {
      const { error } = await supabase.supabaseClient.from('dalins').insert(item);

      if (error?.code === '23505') {
        console.log('duplicate', item.hash);
        continue;
      } else if (error) {
        console.error(item.product_id, error);
        break;
      } else {
        categorySet.add(id);
        addedDiscountCount += 1;
        //   console.log(`Inserted ${id}: data.length=${data.length}`);
      }
    }
  }

  console.log('--- getAllDiscountsByCategory ---');
  console.log(
    'categorySetSize:',
    categorySet.size,
    'lastProductId:',
    Array.from(categorySet).pop(),
  );
  console.log('addedDiscountCount:', addedDiscountCount);
}

(async () => {
  // await getAllDiscountsByItem();
  await getAllDiscountsByCategory();
})();
