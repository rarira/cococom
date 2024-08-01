import { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types';

export type SearchQueryParams = {
  keyword: string;
  options: SearchOptionValue[];
};

export type SearchOptionValue = 'item_id' | 'on_sale';

export type SearchHistory = SearchQueryParams & {
  hash: string;
};

export type SearchItemOptionInfo = {
  label: string;
  indicatorColor: string;
  iconColor: string;
};

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
