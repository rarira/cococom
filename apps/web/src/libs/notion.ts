import { Client } from '@notionhq/client';
import { NotionCompatAPI } from 'notion-compat';

const notion = new NotionCompatAPI(
  new Client({
    auth: process.env.NOTION_API_KEY,
  }),
);

export const getPage = async (pageId: string) => {
  return notion.getPage(pageId);
};
