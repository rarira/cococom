/* eslint-disable import/order */
/* eslint-disable turbo/no-undeclared-env-vars */
// eslint-disable-next-line import/order
import { loadEnv, readJsonFile, writeJsonFile } from '../libs/util.js';

loadEnv();

import axios from 'axios';
import * as cheerio from 'cheerio';
import dayjs from 'dayjs';

import { download } from '../libs/axios.js';
import { minus1MS } from '../libs/date.js';
import { addReletedItemId, supabase, updateItemHistory } from '../libs/supabase.js';
import { OnlineProduct, OnlineSubCategoryLink, SearchApiResult } from '../libs/types.js';

import { InsertDiscount } from '@cococom/supabase/types';
import {
  buildDownloadedImagesIndex,
  DownloadedImagesIndex,
  getMostRecentDownloadedImagesIndex,
  getMostRecentUniqueItemIds,
  retryFailedUploading,
  UniqueItemId,
  updateNewlyAddedImages,
  uploadImages,
} from '../libs/images.js';

const dateArgument = process.argv[2];

const CATEGORY_EXCLUDE = ['cos_whsonly', 'cos_22', 'cos_10.12'];
const CATEGORY_TO_DEEP = ['cos_10.1', 'cos_10.4', 'cos_10.10'];

const date = dateArgument || new Date().toISOString().split('T')[0];

const newItems: string[] = [];
const noPriceValue = new Set<string>();

const IS_PROD_ENVIROMENT = process.env.NODE_ENV === 'PROD';

let newDiscountsCount = 0;

type ItemId = { id: number; itemId: string; online_url: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createSubCategoryLink($: cheerio.CheerioAPI, element: any) {
  const fullLink = $(element).attr('href');

  if (!fullLink) {
    return;
  }

  const category = fullLink.split('/c/').pop();

  if (
    !category?.startsWith('cos') ||
    CATEGORY_EXCLUDE.includes(category) ||
    category.startsWith('cos_17') ||
    category.startsWith('cos_18') ||
    category.startsWith('cos_morning')
  ) {
    return;
  }

  if (CATEGORY_TO_DEEP.includes(category)) {
    const subSubCategories = getSubSubCategories($, element);

    if (subSubCategories) {
      return subSubCategories;
    }
  }

  return [
    {
      fullLink: !fullLink.startsWith('https') ? `https://www.costco.co.kr${fullLink}` : fullLink,
      category,
      title: $(element).text(),
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSubSubCategories($: cheerio.CheerioAPI, element: any) {
  const parentElement = $(element).parent();

  if (!parentElement) {
    return;
  }

  const childUlList = parentElement.next('ul');
  if (!childUlList) {
    return;
  }

  const childLiList = childUlList.children('li');

  if (!childLiList) {
    return;
  }

  const objectList: OnlineSubCategoryLink[] = [];

  childLiList!.each(function () {
    const aElement = $(this).children('a');
    if (!aElement) {
      return;
    }

    const object = createSubCategoryLink($, aElement);
    if (object) {
      objectList.push(...object);
    }
  });

  return objectList;
}

// async function getAllCategoryInfo() {
//   const subCategoryLinks: OnlineSubCategoryLink[] = [];
//   try {
//     const response = await axios.get(`${process.env['3RD_API_SITEMAP_URL']!}`);

//     const $ = cheerio.load(response.data);

//     $('.sub_category .sub-list-title a').each((_index, element) => {
//       const object = createSubCategoryLink($, element);
//       if (object) {
//         subCategoryLinks.push(...object);
//       }
//     });
//   } catch (error) {
//     console.error(error);
//   }

//   console.log('subCategoryLinks', subCategoryLinks.length);

//   writeJsonFile('data/online_subCategoryLinks.json', subCategoryLinks);
// }

async function getAllItemsByCategory(category: string, categoryId: number) {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const apiUrl = `${process.env['3RD_API_URL']}/search?fields=FULL&query=&lang=ko&curr=KRW&pageSize=100&category=${category}`;

  try {
    const response = await axios.get<SearchApiResult>(apiUrl);

    const productsWithCategoryId = response.data.products.map(product => {
      product.categoryId = categoryId;
      return product;
    });

    if (response.data.pagination.totalPages === 1) {
      return {
        totalProducts: response.data.pagination.totalResults,
        products: productsWithCategoryId,
      };
    }

    const products = [...productsWithCategoryId];
    for (let i = 1; i < response.data.pagination.totalPages; i++) {
      const paginationResponse = await axios.get<SearchApiResult>(`${apiUrl}&currentPage=${i}`);
      const paginationProducts = paginationResponse.data.products.map(product => {
        product.categoryId = categoryId;
        return product;
      });
      products.push(...paginationProducts);
    }

    if (response.data.pagination.totalResults !== products.length) {
      console.error(
        'pagination mismatch',
        category,
        response.data.pagination.totalResults,
        response.data.products.length,
      );
    }

    return { totalProducts: response.data.pagination.totalResults, products };
  } catch (error) {
    console.error(error);
    return { totalProducts: 0, products: [] };
  }
}

async function getAllItems() {
  const allProducts: OnlineProduct[] = [];

  const updatedSubCategoryLinks = (await readJsonFile(
    'data/readonly/online_updatedSubCategoryLinks.json',
  )) as OnlineSubCategoryLink[];

  console.log('updatedSubCategoryLinks', updatedSubCategoryLinks.length);

  const promises = updatedSubCategoryLinks.map(async subCategoryLink => {
    // if (subCategoryLink.category !== 'cos_10.4.4') return null;

    const { totalProducts, products } = await getAllItemsByCategory(
      subCategoryLink.category,
      subCategoryLink.categoryId!,
    );

    console.log('category', subCategoryLink.category, 'totalProducts', totalProducts);
    allProducts.push(...products);
  });

  const results = await Promise.allSettled(promises.filter(promise => promise !== null));

  for (const [index, result] of results.entries()) {
    if (result.status === 'rejected') {
      let successful = false;
      do {
        try {
          await promises[index];
          successful = true;
        } catch (error) {
          //do nothing here
          console.error('retry error', (error as Error).message);
        }
      } while (!successful);
    }
  }

  const uniqueProducts = await removeDuplicateProducts(allProducts);

  writeJsonFile(`data/online_products_${date}.json`, uniqueProducts);

  const saleProducts: OnlineProduct[] = allProducts.filter(
    product => product.couponDiscount?.discountValue,
  );

  if (!saleProducts?.length) {
    console.log('no sale products');
    return;
  }

  const tempObject: Record<string, OnlineProduct> = {};

  for (const product of saleProducts) {
    if (!product.code) {
      console.log('no code', product.name);
    }
    if (!product.name) {
      console.log('no name', product.code);
    }
    if (!product.categoryId) {
      console.log('no categoryId', product.code);
    }

    if (!product.basePrice?.value || !product.price?.value) {
      console.log('no price or basePrice', product.code);
    }

    if (!tempObject[product.code]) tempObject[product.code] = product;
  }

  const salesProductsWithNoDuplicate = Object.values(tempObject);

  writeJsonFile(
    `data/online_saleProducts_${date}.json`,
    Object.values(salesProductsWithNoDuplicate),
  );

  console.log('sales product count', saleProducts.length, salesProductsWithNoDuplicate.length);
}

async function removeDuplicateProducts(products: OnlineProduct[]) {
  const codeSet = new Set<string>();

  const uniqueProducts = products.filter(product => {
    if (codeSet.has(product.code)) {
      return false;
    } else {
      codeSet.add(product.code);
      return true;
    }
  });

  console.log('all products', products.length, 'uniqueProducts', uniqueProducts.length);

  return uniqueProducts;
}

async function downloadImage({
  product,
  uniqueItemIds,
  downloadedImagesIndex,
  itemIds,
  jpg,
}: {
  product: OnlineProduct;
  uniqueItemIds: UniqueItemId;
  downloadedImagesIndex: DownloadedImagesIndex;
  itemIds: { id: number; itemId: string; online_url: string }[];
  jpg?: boolean;
}) {
  const productImage = product.images.find(
    image => image.format === (jpg ? 'product' : 'product-webp'),
  );

  async function saveImage(exists: boolean) {
    if (!productImage) {
      return;
    }

    try {
      await download({
        url: `https://www.costco.co.kr${productImage!.url}`,
        localPath: `../downloads/online-images/${exists ? 'in' : 'out'}`,
        fileName: `${product.code}.${jpg ? 'jpg' : 'webp'}`,
      });
    } catch (error) {
      console.error('download image error', error);
    }
  }

  if (uniqueItemIds[product.code] !== undefined) {
    if (uniqueItemIds[product.code]?.online !== null) {
      itemIds.push({
        id: uniqueItemIds[product.code]?.online as number,
        itemId: product.code + '_online',
        online_url: product.url,
      });
    }

    if (uniqueItemIds[product.code]?.offline === null) {
      itemIds.push({
        id: uniqueItemIds[product.code]?.offline as number,
        itemId: product.code,
        online_url: product.url,
      });
    }
  } else {
    if (downloadedImagesIndex[product.code] === undefined) {
      await saveImage(false);
    }
  }
}

async function downloadImages() {
  console.log(date, 'will download images');
  const products = (await readJsonFile(`data/online_products_${date}.json`)) as OnlineProduct[];

  const uniqueItemIds = await getMostRecentUniqueItemIds();

  const downloadedImagesIndex = await getMostRecentDownloadedImagesIndex();

  const itemIds: ItemId[] = [];

  for (const product of products) {
    await downloadImage({ product, itemIds, uniqueItemIds, downloadedImagesIndex });
  }

  await buildDownloadedImagesIndex();

  writeJsonFile(`data/online_downloadResult_itemIds_${date}.json`, itemIds);
}

async function upsertOnlineUrlToItem() {
  const itemIds = (await readJsonFile(
    `data/online_downloadResult_itemIds_${date}.json`,
  )) as ItemId[];

  const { data: itemsWithNoOnlineUrl } = await supabase.supabaseClient
    .from('items')
    .select('id')
    .is('online_url', null);

  const itemsWithNoOnlineUrlSet = new Set((itemsWithNoOnlineUrl ?? []).map(item => item.id));

  console.log(
    'itemsWithNoOnlineUrl',
    itemsWithNoOnlineUrl?.length,
    itemsWithNoOnlineUrlSet.has(242408),
  );
  const filteredItemIds = itemIds.filter(item => !!item.id && itemsWithNoOnlineUrlSet.has(item.id));

  const result = await supabase.items.upsertItem(filteredItemIds, {
    ignoreDuplicates: false,
    onConflict: 'itemId',
  });

  console.log('upsertOnlineUrlToItem', result?.length);
}

async function manageSoldOutDiscounts() {
  const salesProducts = (await readJsonFile(
    `data/online_saleProducts_${date}.json`,
  )) as OnlineProduct[];

  const salesProductsCodeSet = new Set<string>(salesProducts.map(product => product.code));

  console.log(date, 'will manage sold out discounts for', salesProducts.length, 'products');

  try {
    const result = await supabase.discounts.fetchCurrentOnlineDiscounts(date!);

    if (!result?.length) {
      console.error('no current online discounts');
      return;
    }

    const soldOutDiscounts = result.filter(
      discount => !salesProductsCodeSet.has(discount.itemId.split('_')[0]!),
    );

    const discountsToUpsert = soldOutDiscounts.map(discount => {
      return {
        ...discount,
        endDate: minus1MS(dayjs()),
      };
    });

    const upsertDiscountResult = await supabase.discounts.upsertDiscount(
      discountsToUpsert as InsertDiscount[],
      {
        ignoreDuplicates: false,
        onConflict: 'discountHash',
      },
    );

    console.log(
      'soldOutDiscounts',
      soldOutDiscounts.length,
      'upsertDiscountResult',
      upsertDiscountResult?.length,
    );
  } catch (error) {
    console.error('fetchCurrentOnlineDiscounts error', error);
  }
}

async function uploadNewRecords() {
  const salesProducts = (await readJsonFile(
    `data/online_saleProducts_${date}.json`,
  )) as OnlineProduct[];

  salesProducts.forEach(product => {
    if (!product.code) {
      console.log('no code', product.name);
    }

    if (!product.name) {
      console.log('no name', product.code);
    }

    if (!product.categoryId) {
      console.log('no categoryId', product.code);
    }

    if (!product.basePrice?.value) {
      console.log('no basePrice', product.code);
      noPriceValue.add(product.code);
    }

    if (!product.price?.value) {
      console.log('no price value', product.code);
      noPriceValue.add(product.code);
    }
  });

  const upsertItemsMap = salesProducts.map(product => ({
    itemId: product.code + '_online',
    itemName: product.name,
    categoryId: product.categoryId,
    is_online: true,
    online_url: product.url,
  }));

  const newlyAddedItems = await supabase.items.upsertItem(upsertItemsMap);

  if (newlyAddedItems?.length) {
    newItems.push(...newlyAddedItems.map(item => item.itemId));
    for (const newlyAddedItem of newlyAddedItems) {
      await addReletedItemId(newlyAddedItem);
    }

    if (!IS_PROD_ENVIROMENT) {
      await updateNewlyAddedImages(newlyAddedItems);
      await uploadImages(`downloads/final/${date}`);
    }
  }

  console.log(`${newlyAddedItems?.length ?? 0} new items added`);

  console.log('will upsert discounts', salesProducts.length);

  try {
    const newlyAddedDiscounts = await supabase.discounts.upsertDiscount(
      salesProducts.map(product => {
        if (!product.couponDiscount) {
          console.log('no couponDiscount', JSON.stringify(product));
        }

        return {
          itemId: product.code + '_online',
          startDate: product.couponDiscount!.discountStartDate,
          endDate: product.couponDiscount!.discountEndDate,
          discount: product.couponDiscount!.discountValue,
          price: product.basePrice?.value || 0,
          discountPrice: product.price?.value || 0,
          discountHash: `${product.code}_online_${product.couponDiscount!.discountStartDate}_${product.couponDiscount!.discountEndDate}`,
          discountRate: product.basePrice?.value
            ? product.couponDiscount!.discountValue / product.basePrice?.value
            : null,
          is_online: true,
        };
      }),
      // { ignoreDuplicates: false, onConflict: 'discountHash' },
    );

    console.log('newlyAddedDiscounts', newlyAddedDiscounts?.length);
    if (newlyAddedDiscounts?.length) {
      newDiscountsCount += newlyAddedDiscounts.length;
      const newlyAddedDiscountsItemIdsSet = new Set(
        ...newlyAddedDiscounts.map(discount => discount.itemId),
      );

      for (const code of noPriceValue) {
        if (!newlyAddedDiscountsItemIdsSet.has(code)) {
          noPriceValue.delete(code);
        }
      }

      updateItemHistory(newlyAddedDiscounts);
    }
  } catch (error) {
    console.error('upsert discount error', error);
  }
}

async function updateRelatedItemId() {
  const data = await supabase.items.fetchOnlineItemsWithNullRelatedItem();

  if (!data?.length) {
    console.log('no data');
    return;
  }

  for (const onlineItem of data) {
    await addReletedItemId(onlineItem);
  }
}

async function createHistory() {
  if (!newItems.length && !newDiscountsCount) return;

  await supabase.histories.insertHistory({
    new_item_count: newItems.length ?? 0,
    added_discount_count: newDiscountsCount,
    no_images: [],
    no_price: Array.from(noPriceValue),
    is_online: true,
  });
}

(async () => {
  // 카테고리 업데이트
  // await getAllCategoryInfo();

  console.log('start online fetching in ', process.env.NODE_ENV ?? 'staging', ' environment');

  // 루틴
  if (!IS_PROD_ENVIROMENT) {
    await getAllItems();
    await downloadImages();
  }
  await manageSoldOutDiscounts();
  await uploadNewRecords();
  await upsertOnlineUrlToItem();
  await updateRelatedItemId();
  await createHistory();

  await retryFailedUploading();
})();
