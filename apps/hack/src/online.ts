/* eslint-disable turbo/no-undeclared-env-vars */
// eslint-disable-next-line import/order
import { loadEnv, readJsonFile, writeJsonFile } from '../libs/util.js';

loadEnv();

import axios from 'axios';
import * as cheerio from 'cheerio';
import dayjs from 'dayjs';

import { download } from '../libs/axios.js';
import { minus1MS } from '../libs/date.js';
import { supabase, updateItemHistory } from '../libs/supabase.js';
import {
  DownloadResultDb,
  OnlineProduct,
  OnlineSubCategoryLink,
  SearchApiResult,
} from '../libs/types.js';

import { InsertDiscount } from '@cococom/supabase/libs';

const CATEGORY_EXCLUDE = ['cos_whsonly', 'cos_22', 'cos_10.12'];
const CATEGORY_TO_DEEP = ['cos_10.1', 'cos_10.4', 'cos_10.10'];

const date = new Date().toISOString().split('T')[0];

const newItems: string[] = [];
const noPriceValue = new Set<string>();

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
    category.startsWith('cos_18')
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

async function getAllCategoryInfo() {
  const subCategoryLinks: OnlineSubCategoryLink[] = [];
  try {
    const response = await axios.get(`${process.env['3RD_API_SITEMAP_URL']!}`);

    const $ = cheerio.load(response.data);

    $('.sub_category .sub-list-title a').each((_index, element) => {
      const object = createSubCategoryLink($, element);
      if (object) {
        subCategoryLinks.push(...object);
      }
    });
  } catch (error) {
    console.error(error);
  }

  console.log('subCategoryLinks', subCategoryLinks.length);

  await writeJsonFile('data/online_subCategoryLinks.json', subCategoryLinks);
}

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
  let productsCount = 0;

  const allProducts: OnlineProduct[] = [];

  const updatedSubCategoryLinks = (await readJsonFile(
    'data/online_updatedSubCategoryLinks.json',
  )) as OnlineSubCategoryLink[];

  console.log('updatedSubCategoryLinks', updatedSubCategoryLinks.length);

  for (const subCategoryLink of updatedSubCategoryLinks) {
    const { totalProducts, products } = await getAllItemsByCategory(
      subCategoryLink.category,
      subCategoryLink.categoryId!,
    );

    console.log('category', subCategoryLink.category, 'totalProducts', totalProducts);
    allProducts.push(...products);
    productsCount += totalProducts;
  }

  const uniqueProducts = removeDuplicateProducts(allProducts);

  await writeJsonFile(`data/online_products_${date}.json`, uniqueProducts);

  const saleProducts: OnlineProduct[] = allProducts.filter(
    product => product.couponDiscount?.discountValue,
  );

  if (!saleProducts?.length) {
    console.log('no sale products');
    return;
  }

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
  }

  await writeJsonFile(`data/online_saleProducts_${date}.json`, saleProducts);

  console.log('sales product count', saleProducts.length);
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
  codedb,
  itemIds,
  jpg,
}: {
  product: OnlineProduct;
  codedb: DownloadResultDb;
  itemIds: { id: number; itemId: string; online_url: string }[];
  jpg?: boolean;
}) {
  const productImage = product.images.find(
    image => image.format === (jpg ? 'product' : 'product-webp'),
  );

  async function saveImage(exists: boolean) {
    if (!productImage) {
      codedb.noImage.push(product.code);
      return;
    }

    try {
      await download({
        url: `https://www.costco.co.kr${productImage!.url}`,
        localPath: `../downloads/online-images/${exists ? 'in' : 'out'}`,
        fileName: `${product.code}.${jpg ? 'jpg' : 'webp'}`,
      });
    } catch (error) {
      codedb.downloadError.push(product.code);
    }
  }

  try {
    const data = await supabase.fetchDataLike(
      { column: 'itemId', value: product.code },
      'items',
      'id, itemId, itemName',
    );

    if (data.length === 0) {
      await saveImage(false);
      return;
    }

    for (const item of data) {
      itemIds.push({ id: item.id, itemId: item.itemId, online_url: product.url });

      if (item.itemName !== product.name) {
        codedb.nameDiff.push({
          code: product.code,
          dbName: item.itemName!,
          onlineName: product.name,
        });
      }

      await saveImage(true);
    }
  } catch (error) {
    console.error('fetchDataLike error', error);
    return;
  }
}

async function downloadImages() {
  const products = (await readJsonFile(`data/online_products_${date}.json`)) as OnlineProduct[];
  const codedb: DownloadResultDb = { noImage: [], nameDiff: [], downloadError: [] };

  const itemIds: ItemId[] = [];

  for (const product of products) {
    await downloadImage({ product, codedb, itemIds });
  }

  console.log(
    'products',
    products.length,
    'itemIds',
    itemIds.length,
    'lastItemId',
    itemIds[itemIds.length - 1],
  );

  await writeJsonFile(`data/online_downloadResult_itemIds_${date}.json`, itemIds);

  await writeJsonFile(`data/online_downloadResult_codedb_${date}.json`, codedb);
}

async function upsertOnlineUrlToItem() {
  const itemIds = (await readJsonFile(
    `data/online_downloadResult_itemIds_${date}.json`,
  )) as ItemId[];
  // await supabase.nullifyOnlineUrl();

  // const uniqueItemIds = new Set();

  // itemIds.forEach(item => {
  //   if (uniqueItemIds.has(item.itemId)) {
  //     console.log('duplicate', item.itemId);
  //   } else {
  //     uniqueItemIds.add(item.itemId);
  //   }
  // });

  // console.log(itemIds.length, uniqueItemIds.size);
  const result = await supabase.upsertItem(itemIds, {
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
    const result = await supabase.fetchCurrentOnlineDiscounts(date!);

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

    const upsertDiscountResult = await supabase.upsertDiscount(
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

  salesProducts.forEach(async product => {
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

  const newlyAddedItems = await supabase.upsertItem(
    salesProducts.map(product => ({
      itemId: product.code + '_online',
      itemName: product.name,
      categoryId: product.categoryId,
      is_online: true,
      online_url: product.url,
    })),
  );

  if (newlyAddedItems?.length) {
    newItems.push(...newlyAddedItems.map(item => item.itemId));
  }

  console.log(`${newlyAddedItems?.length ?? 0} new items added`);

  try {
    const newlyAddedDiscounts = await supabase.upsertDiscount(
      salesProducts.map(product => {
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
    );

    if (newlyAddedDiscounts?.length) {
      newDiscountsCount += newlyAddedDiscounts.length;
      updateItemHistory(newlyAddedDiscounts);
    }
  } catch (error) {
    console.error('upsert discount error', error);
  }
}

async function createHistory() {
  if (!newItems.length) return;

  await supabase.insertHistory({
    new_item_count: newItems.length,
    added_discount_count: newDiscountsCount,
    no_images: [],
    no_price: Array.from(noPriceValue),
    is_online: true,
  });
}

(async () => {
  // await getAllCategoryInfo();
  await getAllItems();
  // await updateDownloadResult();
  await downloadImages();
  await upsertOnlineUrlToItem();
  await manageSoldOutDiscounts();
  await uploadNewRecords();
  await createHistory();
  // 수동으로
  // await updateSubCategoryLinks();
})();
