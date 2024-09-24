import axios from 'axios';
import * as cheerio from 'cheerio';

import { writeJsonFile } from '../libs/util.js';

const SITEMAP_URL = 'https://www.costco.co.kr/CostcoKorea_Sitemap';

const CATEGORY_EXCLUDE = ['cos_whsonly', 'cos_22'];

type SubCategoryLink = {
  fullLink: string;
  category: string;
};

async function getAllCategoryInfo() {
  const subCategoryLinks: SubCategoryLink[] = [];
  try {
    const response = await axios.get(SITEMAP_URL);

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
