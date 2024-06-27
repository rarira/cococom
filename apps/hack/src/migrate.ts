/* eslint-disable @typescript-eslint/no-unused-vars */
import { loadEnv } from '../libs/util';

loadEnv();

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
