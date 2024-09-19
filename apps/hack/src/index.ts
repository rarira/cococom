/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

// eslint-disable-next-line import/order
import { Tables } from '@cococom/supabase/types';
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

const newItems: string[] = [];
const newItemsWithNoImage: string[] = [];
let newDiscountsCount = 0;

async function crawlAllItems() {
  const digitsArray = Array.from({ length: 10 }, (_, i) => i.toString());

  const itemSet = new Set<string>();

  for (const digit of digitsArray) {
    const items = await getSearchResults(digit, itemSet);
    const result = await supabase.upsertItem(
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
  const items = await supabase.fetchAllItems(noLowsetPrice);
  console.log('will  update discounts for', items?.length, 'items');

  for (const item of items) {
    const today = getDateString();
    const discounts = await getSearchResults2(item.itemId, today);
    console.log('discounts for', item.itemId, discounts.length);
    await supabase.upsertDiscount(
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
  const items = await supabase.fetchAllItems();
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
  const items = await supabase.fetchAllItems();

  for (const item of items) {
    const data = await getItem(item.itemId);
    await supabase.updateItem({ categoryId: Number(data.category) }, item.id);
  }
}

async function createCategories() {
  const jsonData = readJsonFile('./data/category.json');
  for (const category of jsonData) {
    await supabase.upsertCategory(category);
  }
}

async function updateDiscounts(date?: string) {
  const discounts = await getAllDatas(date || getDateString());

  console.log('discounts count', discounts.length);
  const newlyAddedItems = await supabase.upsertItem(
    discounts.map(discount => ({
      itemId: discount.productcode as string,
      itemName: discount.productname,
    })),
  );

  console.log(`${newlyAddedItems?.length ?? 0} new items added`);

  const newlyAddedDiscounts = await supabase.upsertDiscount(
    discounts.map(discount => ({
      itemId: discount.productcode as string,
      startDate: getISOTimeStringWithTimezone(discount.startdate),
      endDate: addDays(getDateWithTimezone(discount.enddate), 1),
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
      await supabase.updateItem({ categoryId: Number(data.category) }, item.id);
    }
  }

  if (newlyAddedDiscounts?.length) {
    newDiscountsCount += newlyAddedDiscounts.length;
    for (const newlyAddedDiscount of newlyAddedDiscounts) {
      try {
        const data = await supabase.fetchData(
          { value: newlyAddedDiscount.itemId, column: 'itemId' },
          'items',
        );
        if (!data) throw new Error('no data');

        const update: Partial<Tables<'items'>> = {
          bestDiscountRate: newlyAddedDiscount.discountRate,
          bestDiscount: newlyAddedDiscount.discount,
        };

        if (
          newlyAddedDiscount.discountRate &&
          data.bestDiscountRate &&
          newlyAddedDiscount.discountRate > data.bestDiscountRate
        ) {
          update.bestDiscountRate = newlyAddedDiscount.discountRate;
        }

        if (!data.lowestPrice || newlyAddedDiscount.discountPrice < data.lowestPrice) {
          update.lowestPrice = newlyAddedDiscount.discountPrice;
        }

        if (
          newlyAddedDiscount.discount &&
          data.bestDiscount &&
          data.bestDiscount < newlyAddedDiscount.discount
        ) {
          update.bestDiscount = newlyAddedDiscount.discount;
        }

        if (Object.keys(update).length === 0) continue;

        await supabase.updateItem(update, data.id);
      } catch (e) {
        console.error(e);
        continue;
      }
    }
  }
}

async function createHistory() {
  await supabase.insertHistory({
    new_item_count: newItems.length,
    added_discount_count: newDiscountsCount,
    no_images: newItemsWithNoImage,
  });
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
  // NOTE: 루틴
  await updateDiscounts();
  await createHistory();
})();
