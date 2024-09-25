// eslint-disable-next-line import/order
import { loadEnv, readJsonFile, writeJsonFile } from '../libs/util.js';

loadEnv();

import axios from 'axios';
import * as cheerio from 'cheerio';

import { OnlineProduct, OnlineSubCategoryLink, SearchApiResult } from '../libs/types.js';

const CATEGORY_EXCLUDE = ['cos_whsonly', 'cos_22', 'cos_10.12'];
const CATEGORY_TO_DEEP = ['cos_10.1', 'cos_10.4', 'cos_10.10'];

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
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    const response = await axios.get(process.env['3RD_API_SITEMAP_URL']!);

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
  const apiUrl = `${process.env['3RD_API_URL']}pageSize=100&category=${category}`;

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

  for (const subCategoryLink of updatedSubCategoryLinks) {
    const { totalProducts, products } = await getAllItemsByCategory(
      subCategoryLink.category,
      subCategoryLink.categoryId!,
    );
    allProducts.push(...products);
    productsCount += totalProducts;
  }

  await writeJsonFile('data/online_products.json', allProducts);

  console.log('product  array count', allProducts.length, 'productsCount', productsCount);
}

async function compareLinks() {
  const subCategoryLinks = (await readJsonFile(
    'data/online_subCategoryLinks.json',
  )) as OnlineSubCategoryLink[];
  const updated = (await readJsonFile(
    'data/online_updatedSubCategoryLinks.json',
  )) as OnlineSubCategoryLink[];

  const categorySet = new Set(subCategoryLinks.map(subCategoryLink => subCategoryLink.category));
  const productCategorySet = new Set(updated.map(update => update.category));

  console.log('categorySet', categorySet.size);
  console.log('productCategorySet', productCategorySet.size);

  const diff = [...categorySet].filter(category => !productCategorySet.has(category));
  console.log('diff', diff);
}

async function findDuplicateCategory() {
  const subCategoryLinks = (await readJsonFile(
    'data/online_subCategoryLinks.json',
  )) as OnlineSubCategoryLink[];

  subCategoryLinks.forEach(subCategoryLink => {
    const count = subCategoryLinks.filter(
      link => link.category === subCategoryLink.category,
    ).length;

    if (count > 1) {
      console.log('duplicate', subCategoryLink.category);
    }
  });
}

(async () => {
  await getAllCategoryInfo();
  await getAllItems();

  // 수동으로
  // await updateSubCategoryLinks();

  // 검증용
  // await findDuplicateCategory();
  // await compareLinks();
})();
