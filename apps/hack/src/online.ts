// eslint-disable-next-line import/order
import { loadEnv, readJsonFile, writeJsonFile } from '../libs/util.js';

loadEnv();

import axios from 'axios';
import * as cheerio from 'cheerio';

import { OnlineProduct, OnlineSubCategoryLink, SearchApiResult } from '../libs/types.js';

const CATEGORY_EXCLUDE = ['cos_whsonly', 'cos_22', 'cos_17_all'];

async function getAllCategoryInfo() {
  const subCategoryLinks: OnlineSubCategoryLink[] = [];
  try {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    const response = await axios.get(process.env['3RD_API_SITEMAP_URL']!);

    const $ = cheerio.load(response.data);

    $('.sub_category .sub-list-title a').each((index, element) => {
      const fullLink = $(element).attr('href');
      if (!fullLink) {
        return;
      }
      const category = fullLink.split('/c/').pop();
      if (!category?.startsWith('cos') || CATEGORY_EXCLUDE.includes(category)) {
        return;
      }
      const object = {
        fullLink,
        category,
        title: $(element).text(),
      };
      subCategoryLinks.push(object);
    });
  } catch (error) {
    console.error(error);
  }

  console.log('subCategoryLinks', subCategoryLinks.length);

  await writeJsonFile('temp/subCategoryLinks.json', subCategoryLinks);
}

async function getAllItemsByCategory(category: string) {
  //   console.log('getAllItemsByCategory', category);
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const apiUrl = `${process.env['3RD_API_URL']}pageSize=100&category=${category}`;

  try {
    const response = await axios.get<SearchApiResult>(apiUrl);
    if (response.data.pagination.totalPages === 1) {
      return {
        totalProducts: response.data.pagination.totalResults,
        products: response.data.products,
      };
    }

    const products = [...response.data.products];
    for (let i = 1; i < response.data.pagination.totalPages; i++) {
      const paginationResponse = await axios.get<SearchApiResult>(`${apiUrl}&currentPage=${i}`);
      products.push(...paginationResponse.data.products);
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

  const subCategoryLinks = await readJsonFile('data/online_subCategoryLinks.json');
  for (const subCategoryLink of subCategoryLinks) {
    const { totalProducts, products } = await getAllItemsByCategory(subCategoryLink.category);
    allProducts.push(...products);
    productsCount += totalProducts;
  }

  await writeJsonFile('data/online_products.json', allProducts);

  console.log('product  array count', allProducts.length, 'productsCount', productsCount);
}

(async () => {
  await getAllCategoryInfo();
  //   await getAllItems();
})();
