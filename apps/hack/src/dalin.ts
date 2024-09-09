// eslint-disable-next-line import/order
import { supabase } from '../libs/supabase.js';
import { loadEnv } from '../libs/util.js';

loadEnv();

import axios from 'axios';

function makeDbData({ like_cnt, share_cnt, ...restData }: any) {
  return restData;
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

  console.log(idArray.length);
  for (const id of idArray) {
    // if (id !== 5402) continue;
    // console.log(`${process.env['2ND_API_URL']}/productView/${id}`);

    const { data } = await axios.get(`${process.env['2ND_API_URL']}/productView/${id}`);

    if (!data || data.length === 0) continue;

    const newData = data.map(makeDbData);

    const { error } = await supabase.supabaseClient.from('dalins').insert(newData);

    if (error) {
      console.error(id, error.message);
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
  const categoryArray = [];
  let addedDiscountCount = 0;

  const idArray = new Array<number>(20)
    .fill(0)
    .map((_, i) => {
      // if (i <= 3286) return null;
      return i;
    })
    .filter(Boolean);

  console.log(idArray.length);
  for (const id of idArray) {
    // if (id !== 5402) continue;
    // console.log(`${process.env['2ND_API_URL']}/productView/${id}`);

    const { data } = await axios.get(`${process.env['2ND_API_URL']}/productList/${id}`);

    if (!data || data.length === 0) continue;

    const newData = data.map(makeDbData);

    const { error } = await supabase.supabaseClient.from('dalins').insert(newData);

    if (error) {
      console.error(id, error.message);
      break;
    } else {
      categoryArray.push(id);
      addedDiscountCount += data.length;
      //   console.log(`Inserted ${id}: data.length=${data.length}`);
    }
  }

  console.log('--- getAllDiscountsByCategory ---');
  console.log(
    'categoryArrayLength:',
    categoryArray.length,
    'lastProductId:',
    categoryArray[categoryArray.length - 1],
  );
  console.log('addedDiscountCount:', addedDiscountCount);
}

(async () => {
  //  await getAllDiscountsByItem();
  await getAllDiscountsByCategory();
})();
