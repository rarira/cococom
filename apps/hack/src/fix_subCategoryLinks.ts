/* eslint-disable import/order */

import { loadEnv, readJsonFile } from '../libs/util.js';

loadEnv();

import { OnlineSubCategoryLink } from '../libs/types.js';

(async () => {
  const updatedSubCategoryLinks = (await readJsonFile(
    'data/readonly/online_updatedSubCategoryLinks.json',
  )) as OnlineSubCategoryLink[];

  throw new Error('online_updatedSubCategoryLinks.json is read only');

  // console.log('fixing updatedSubCategoryLinks', updatedSubCategoryLinks.length);

  // for (const link of updatedSubCategoryLinks) {
  //   const apiUrl = `${process.env['3RD_API_URL']}/search?fields=FULL&query=&lang=ko&curr=KRW&pageSize=100&category=${link.category}`;

  //   const response = await axios.get<SearchApiResult>(apiUrl);

  //   const products = response.data.products;

  //   console.log(link.category, products.length);

  //   for (const product of products) {
  //     try {
  //       const itemInDb = await supabase.fetchData(
  //         {
  //           column: 'itemId',
  //           value: `${product.code}_online`,
  //         },
  //         'items',
  //         'categoryId',
  //       );

  //       if (!itemInDb) continue;

  //       if (!itemInDb.categoryId) {
  //         console.log('itemInDb.categoryId is null', product.code);
  //         continue;
  //       }

  //       link.categoryId = itemInDb.categoryId!;
  //       break;
  //     } catch (error) {
  //       if (error.code === 'PGRST116') continue;
  //       console.error(link.category, error);
  //     }
  //   }
  // }

  // writeJsonFile('data/readonly/online_updatedSubCategoryLinks.json', updatedSubCategoryLinks);
})();
