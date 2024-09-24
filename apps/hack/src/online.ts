// eslint-disable-next-line import/order
import { loadEnv, writeJsonFile } from '../libs/util.js';

loadEnv();

import axios from 'axios';
import * as cheerio from 'cheerio';

const CATEGORY_EXCLUDE = ['cos_whsonly', 'cos_22'];

type SubCategoryLink = {
  fullLink: string;
  category: string;
};

async function getAllCategoryInfo() {
  const subCategoryLinks: SubCategoryLink[] = [];
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
      };
      subCategoryLinks.push(object);
    });
  } catch (error) {
    console.error(error);
  }

  console.log('subCategoryLinks', subCategoryLinks.length);

  await writeJsonFile('temp/subCategoryLinks.json', subCategoryLinks);
}

(async () => {
  await getAllCategoryInfo();
})();
