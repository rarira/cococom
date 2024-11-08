import {
  Database,
  InfiniteItemsToRender,
  InfiniteQueryResult,
  InfiniteSearchResultPages,
} from '@cococom/supabase/types';
import { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types';

import { SearchItemOptionInfo } from './sort';

export type SearchQueryParams = {
  keyword: string;
  options: SearchOptionValue[];
};

export type SearchOptionValue = 'item_id' | 'on_sale';

export type SearchHistory = SearchQueryParams & {
  hash: string;
};

export type SearchResultToRender = InfiniteItemsToRender<
  Database['public']['Functions']['search_items_by_keyword']['Returns']['items'][number]
>;

export type InfiniteSearchResultData = InfiniteQueryResult<InfiniteSearchResultPages>;

export const SearchItemsOptions = (
  theme: UnistylesTheme,
): Record<SearchOptionValue, SearchItemOptionInfo> => ({
  item_id: {
    label: '상품번호로 검색',
    indicatorColor: theme.colors.tint,
    iconColor: theme.colors.background,
  },
  on_sale: {
    label: '할인 중인 상품만',
    indicatorColor: theme.colors.alert,
    iconColor: 'white',
  },
});

export const getSearchHistoryHash = ({ keyword, options }: SearchQueryParams): string => {
  return `${keyword}${!!options?.length ? -`${options.join('-')}` : ''}`;
};

export const findIndexOfInfiniteSearchResultItem = (
  pages: InfiniteSearchResultPages[],
  newWishListItemId: number,
) => {
  let pagesIndex = 0;
  let nestedItemIndex = 0;

  for (const page of pages) {
    const itemIndex = page.items.findIndex(item => item.id === newWishListItemId);
    if (itemIndex !== -1) {
      nestedItemIndex = itemIndex;
      break;
    }
    pagesIndex += 1;
  }

  return { pagesIndex, nestedItemIndex };
};

export const stringifySearchHistory = (searchHistory: SearchHistory): string => {
  searchHistory.options.sort();
  return JSON.stringify(searchHistory);
};
