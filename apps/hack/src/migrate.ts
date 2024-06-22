import dotenv from 'dotenv';
import path from 'path';

(() => {
  const result = dotenv.config({ path: path.join(__dirname, '..', '.env') }); // .env 파일의 경로를 dotenv.config에 넘겨주고 성공여부를 저장함
  if (result.parsed == undefined)
    // .env 파일 parsing 성공 여부 확인
    throw new Error('Cannot loaded environment variables file.'); // parsing 실패 시 Throwing
})();

// import {
//   createDiscount,
//   getAllDiscounts,
//   getAllItems,
//   getAllCategories,
//   prisma,
//   updateItemWithCategory,
//   upsertItem,
// } from '../libs/prisma';
import { upsertCategory, upsertDiscount, upsertItem } from '../libs/supabase';

(async () => {
  // const categories = await getAllCategories();
  // const categoryPromises = categories.map(category =>
  //   upsertCategory(category),
  // );
  // await Promise.all(categoryPromises);
  // const items = await getAllItems();
  // // console.log(items[0]);
  // console.log(items.length);
  // // const itemPromises = items.map(item => upsertItem(item));
  // try {
  //   const results = await upsertItem(items);
  //   console.log({ results });
  // } catch (e) {
  //   console.error(e);
  // }
  // const discounts = await getAllDiscounts();
  // console.log(discounts.length);
  // try {
  //   const result = await upsertDiscount(discounts as any);
  //   console.log({ result });
  // } catch (e) {
  //   console.error(e);
  // }
})();
