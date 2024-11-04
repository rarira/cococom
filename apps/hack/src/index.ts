/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

// eslint-disable-next-line import/order
import { getAllDatas, getItem, getSearchResults, getSearchResults2 } from '../libs/api.js';
import { downloadImage } from '../libs/axios.js';
import {
  addDays,
  getDateString,
  getDateWithTimezone,
  getISOTimeStringWithTimezone,
  minus1MS,
} from '../libs/date.js';
import { addReletedItemId, supabase, updateItemHistory, updateNoImages } from '../libs/supabase.js';
import { loadEnv, readJsonFile, writeJsonFile } from '../libs/util.js';

loadEnv();

const newItems: string[] = [];
const newItemsWithNoImage: string[] = [];
let newDiscountsCount = 0;

async function crawlAllItems() {
  const digitsArray = Array.from({ length: 10 }, (_, i) => i.toString());

  const itemSet = new Set<string>();

  for (const digit of digitsArray) {
    const items = await getSearchResults(digit, itemSet);
    const result = await supabase.items.upsertItem(
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

async function crawlAllDiscounts(noLowsetPrice = false) {
  const items = await supabase.items.fetchAllItems(noLowsetPrice);
  console.log('will  update discounts for', items?.length, 'items');

  for (const item of items) {
    const today = getDateString();
    const discounts = await getSearchResults2(item.itemId, today);
    console.log('discounts for', item.itemId, discounts.length);
    await supabase.discounts.upsertDiscount(
      discounts.map(discount => ({
        itemId: item.itemId,
        startDate: getISOTimeStringWithTimezone(discount.startdate),
        endDate: addDays(getDateWithTimezone(discount.enddate), 1).toISOString(),
        price: discount.price,
        discount: discount.discount,
        discountPrice: discount.discountprice,
        discountHash: `${item.itemId}_${discount.startdate}_${discount.enddate}`,
      })),
    );
  }
}

async function downloadAllImages() {
  const items = await supabase.items.fetchAllItems();
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
  const items = await supabase.items.fetchAllItems();

  for (const item of items) {
    const data = await getItem(item.itemId);
    await supabase.items.updateItem({ categoryId: Number(data.category) }, item.id);
  }
}

async function createCategories() {
  const jsonData = readJsonFile('./data/category.json');
  for (const category of jsonData) {
    await supabase.categories.upsertCategory(category);
  }
}

async function updateDiscounts(date?: string) {
  const discounts = await getAllDatas(date || getDateString());

  console.log('discounts count', discounts.length);
  const newlyAddedItems = await supabase.items.upsertItem(
    discounts.map(discount => ({
      itemId: discount.productcode as string,
      itemName: discount.productname,
    })),
  );

  console.log(`${newlyAddedItems?.length ?? 0} new items added`);

  const newlyAddedDiscounts = await supabase.discounts.upsertDiscount(
    discounts.map(discount => ({
      itemId: discount.productcode as string,
      startDate: getISOTimeStringWithTimezone(discount.startdate),
      endDate: minus1MS(addDays(getDateWithTimezone(discount.enddate), 1)),
      price: discount.price,
      discount: discount.discount,
      discountPrice: discount.discountprice,
      discountHash: `${discount.productcode}_${discount.startdate}_${discount.enddate}`,
      discountRate: discount.price ? discount.discount / discount.price : null,
    })),
  );

  console.log(`${newlyAddedDiscounts?.length ?? 0} new discounts added`);

  if (newlyAddedItems?.length) {
    for (const item of newlyAddedItems) {
      newItems.push(item.itemId as string);
      try {
        await downloadImage(item.itemId as string);
      } catch (e) {
        console.log('error downloading image', item.itemId);
        newItemsWithNoImage.push(item.itemId);
      }
      const data = await getItem(item.itemId);

      await addReletedItemId(item, { categoryId: Number(data.category) });
    }
  }

  if (newlyAddedDiscounts?.length) {
    newDiscountsCount += newlyAddedDiscounts.length;
    updateItemHistory(newlyAddedDiscounts);
  }
}

async function createHistory() {
  if (!newItems.length) return;

  await supabase.histories.insertHistory({
    new_item_count: newItems.length,
    added_discount_count: newDiscountsCount,
    no_images: newItemsWithNoImage,
  });
}

async function downloadNoImages(info: { id: number; no_images: string[] | null }) {
  if (!info.no_images || !info.no_images.length) return;

  const no_images = [];
  for (const itemId of info.no_images) {
    try {
      await downloadImage(itemId);
    } catch (e) {
      console.log('error downloading image', itemId);
      no_images.push(itemId);
    }
  }

  console.log('downloadNoImage completed', info.id, info.no_images.length, no_images.length);

  await updateNoImages(no_images, info.id);
}

(async () => {
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
  // await crawlAllDiscounts(true);
  // await downloadAllImages();
  // await updateAllItemCategory();
  // await changeItemCategory();
  // for (const date of dates) {
  //   await updateDiscounts(date);
  // }

  // NOTE: 이미지 host 변경 대응ㅇ
  // const histories = await getAllNoImagesFromHistory('2024-10-01');
  // const downloadNoImagePromises = histories.map(history => downloadNoImages(history));
  // await Promise.allSettled(downloadNoImagePromises);

  // NOTE: 루틴
  await updateDiscounts();
  await createHistory();
})();
