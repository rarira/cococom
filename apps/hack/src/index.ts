/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { getAllDatas, getItem, getSearchResults, getSearchResults2 } from '../libs/api.js';
import { downloadImage } from '../libs/axios.js';
import {
  addDays,
  getDateString,
  getDateWithTimezone,
  getISOTimeStringWithTimezone,
} from '../libs/date.js';
import { supabase } from '../libs/supabase.js';
import { loadEnv, readJsonFile, writeJsonFile } from '../libs/util.js';

loadEnv();



const {
  fetchAllItems,
  updateItem,
  upsertCategory,
  upsertDiscount,
  upsertItem,
} = supabase




const newItems = [];

async function crawlAllItems() {
  const digitsArray = Array.from({ length: 10 }, (_, i) => i.toString());

  const itemSet = new Set<string>();

  for (const digit of digitsArray) {
    const items = await getSearchResults(digit, itemSet);
    const result = await upsertItem(
      items.map(item => {
        return {
          itemId: item.productcode,
          itemName: item.productname,
        };
      }),
    );
    newItems.push(...result);
  }

  console.log(`finished crawling ${itemSet.size} new items`);

  return itemSet.size;
}

async function crawlAllDiscounts() {
  const items = await fetchAllItems();

  for (const item of items) {
    const today = getDateString();
    const discounts = await getSearchResults2(item.itemId, today);
    await upsertDiscount(
      discounts.map(discount => ({
        itemId: item.itemId,
        startDate: getISOTimeStringWithTimezone(discount.startdate),
        endDate: addDays(getDateWithTimezone(discount.enddate), 1),
        price: discount.price,
        discount: discount.discount,
        discountPrice: discount.discountprice,
        discountHash: `${item.itemId}_${discount.startdate}_${discount.enddate}`,
      })),
    );
  }
}

async function downloadAllImages() {
  const items = await fetchAllItems();
  const errors: { itemId: string; statusText: string }[] = [];

  for (const item of items) {
    try {
      await downloadImage(item.itemId);
    } catch (e) {
      errors.push({ itemId: item.itemId, statusText: e.response.statusText });
    }
  }

  if (errors.length > 0) {
    writeJsonFile('download-errors.json', errors);
  }
  console.log('finished downloading images');
}

async function updateAllItemCategory() {
  const items = await fetchAllItems();

  for (const item of items) {
    const data = await getItem(item.itemId);
    await updateItem({ categoryId: Number(data.category) }, item.id);
  }
}

async function createCategories() {
  const jsonData = readJsonFile('./data/category.json');
  for (const category of jsonData) {
    await upsertCategory(category);
  }
}

async function updateDiscounts(date?: string) {
  const discounts = await getAllDatas(date || getDateString());

  console.log(date || getDateString(), discounts.length);

  console.log(discounts[0].productcode);
  const newlyAddedItems = await upsertItem(
    discounts.map(discount => ({
      itemId: discount.productcode as string,
      itemName: discount.productname,
    })),
  );

  console.log(`${newlyAddedItems?.length ?? 0} new items added`);

  const newlyAddedDiscounts = await upsertDiscount(
    discounts.map(discount => ({
      itemId: discount.productcode as string,
      startDate: getISOTimeStringWithTimezone(discount.startdate),
      endDate: addDays(getDateWithTimezone(discount.enddate), 1),
      price: discount.price,
      discount: discount.discount,
      discountPrice: discount.discountprice,
      discountHash: `${discount.productcode}_${discount.startdate}_${discount.enddate}`,
    })),
  );

  console.log(`${newlyAddedDiscounts?.length ?? 0} new discounts added`);

  if (!newlyAddedItems?.length) return;

  for (const item of newlyAddedItems) {
    await downloadImage(item.itemId as string);
    const data = await getItem(item.itemId);
    await updateItem({ categoryId: Number(data.category) }, item.id);
  }
}

(async () => {
  console.log('yahoo');
  // const dates = [
  //   '2024-05-03',
  //   '2024-04-30',
  //   '2024-04-26',
  //   '2024-04-23',
  //   '2024-04-19',
  //   '2024-04-16',
  //   '2024-04-12',
  //   '2024-04-09',
  //   '2024-04-05',
  //   '2024-04-02',
  // ];
  // await createCategories();
  // const itemSize = await crawlAllItems();
  // await crawlAllDiscounts();
  // await downloadAllImages();
  // await updateAllItemCategory();
  // await changeItemCategory();
  // for (const date of dates) {
  //   await updateDiscounts(date);
  // }
  // await updateDiscounts();
})();
