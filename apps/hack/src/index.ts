import dotenv from 'dotenv';
import path from 'path';

(() => {
  const result = dotenv.config({ path: path.join(__dirname, '..', '.env') }); // .env 파일의 경로를 dotenv.config에 넘겨주고 성공여부를 저장함
  if (result.parsed == undefined)
    // .env 파일 parsing 성공 여부 확인
    throw new Error('Cannot loaded environment variables file.'); // parsing 실패 시 Throwing
})();

import { getAllDatas, getItem, getSearchResults, getSearchResults2 } from '../libs/api';
import { downloadImage } from '../libs/axios';
import {
  addDays,
  getDateString,
  getDateWithTimezone,
  getISOTimeStringWithTimezone,
} from '../libs/date';

import { readJsonFile, writeJsonFile } from '../libs/util';
import {
  fetchAllItems,
  updateItem,
  upsertCategory,
  upsertDiscount,
  upsertItem,
} from '../libs/supabase';

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

async function updateDiscounts() {
  const discounts = await getAllDatas(getDateString());

  console.log(getDateString(), discounts.length);

  const newlyAddedItems = await upsertItem(
    discounts.map(discount => ({
      itemId: discount.itemId as string,
      itemName: discount.productname,
    })),
  );

  console.log(`${newlyAddedItems?.length ?? 0} new items added`);

  const newlyAddedDiscounts = await upsertDiscount(
    discounts.map(discount => ({
      itemId: discount.itemId as string,
      startDate: getISOTimeStringWithTimezone(discount.startdate),
      endDate: addDays(getDateWithTimezone(discount.enddate), 1),
      price: discount.price,
      discount: discount.discount,
      discountPrice: discount.discountprice,
      discountHash: `${discount.itemId}_${discount.startdate}_${discount.enddate}`,
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
  // await createCategories();

  // const itemSize = await crawlAllItems();

  // await crawlAllDiscounts();

  // await downloadAllImages();

  // await updateAllItemCategory();

  // await changeItemCategory();

  await updateDiscounts();
})();
