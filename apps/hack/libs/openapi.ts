/* eslint-disable import/order */

import { Category, OnlineSubCategoryLink } from './types.js';
import { loadEnv, readJsonFile, writeJsonFile } from './util.js';

loadEnv();

import OpenAI from 'openai';

// eslint-disable-next-line turbo/no-undeclared-env-vars
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function getCategoryFromChatGPT(title: string, categoryInfo: Category[]): Promise<string> {
  const prompt = `
  주어진 제목 "${title}"을 보고 아래 카테고리 중 가장 적합한 카테고리를 선택하세요:
  ${categoryInfo.map(cat => `${cat.id}. ${cat.name}`).join('\n')}
  만약 적합한 카테고리가 없다면 "기타"를 선택하세요.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
      temperature: 0.5,
    });

    const chatGptResponse = response.choices[0]?.message.content || '기타';
    if (chatGptResponse === '기타') {
      console.error('No category matched for:', title);
    }
    return chatGptResponse.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return '기타';
  }
}

async function matchCategoriesToLinks(links: OnlineSubCategoryLink[], categoryInfo: Category[]) {
  const matchedLinks = await Promise.all(
    links.map(async link => {
      const matchedCategory = await getCategoryFromChatGPT(link.title, categoryInfo);
      return { ...link, categoryId: categoryInfo.find(cat => cat.name === matchedCategory)?.id };
    }),
  );

  return matchedLinks;
}

export async function updateSubCategoryLinks() {
  const subCategoryLinks = (await readJsonFile(
    'data/online_subCategoryLinks.json',
  )) as OnlineSubCategoryLink[];
  const categoryInfo = (await readJsonFile('data/category.json')) as Category[];

  const updatedLinks = await matchCategoriesToLinks(subCategoryLinks, categoryInfo);
  await writeJsonFile('data/online_updatedSubCategoryLinks.json', updatedLinks);
  console.log('Updated subCategoryLinks.json');
}
