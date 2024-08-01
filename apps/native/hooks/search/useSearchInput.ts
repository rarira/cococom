import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';

import { SearchResult } from '@/components/custom/list/search-result';
import { queryKeys } from '@/libs/react-query';
import {
  getSearchHistoryHash,
  SearchHistory,
  SearchOptionValue,
  SearchQueryParams,
} from '@/libs/search';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

type UseSearchInputParams = {
  addSearchHistory: (searchHistory: SearchHistory) => void;
};

export function useSearchInput({ addSearchHistory }: UseSearchInputParams) {
  const [options, setOptions] = useState<SearchOptionValue[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { user } = useUserStore();

  const queryClient = useQueryClient();
  const { keyword: keywordParam, options: optionsParam } = useLocalSearchParams<{
    keyword: string;
    options: SearchOptionValue[];
  }>();

  const fetchResult = useCallback(
    async ({ keyword, options }: SearchQueryParams) => {
      const isOnSaleSearch = options.includes('on_sale');
      const isItemIdSearch = options.includes('item_id');

      let queryFn;
      if (isItemIdSearch) {
        queryFn = () => supabase.fullTextSearchItemsByItemId(keyword, isOnSaleSearch, user?.id);
      } else {
        queryFn = () => supabase.fullTextSearchItemsByKeyworkd(keyword, isOnSaleSearch, user?.id);
      }
      setIsFetching(true);
      try {
        const data = await queryClient.fetchQuery({
          queryKey: queryKeys.search[isItemIdSearch ? 'itemId' : 'keyword'](
            keyword,
            isOnSaleSearch,
            user?.id,
          ),
          queryFn,
        });
        setSearchResult(data);
        addSearchHistory({ keyword, options, hash: getSearchHistoryHash({ keyword, options }) });
      } catch (error) {
        console.error(error);
        setSearchResult(null);
      }
      setIsFetching(false);
    },
    [addSearchHistory, queryClient, user?.id],
  );

  // TODO : 테스트 필요
  useLayoutEffect(() => {
    if (keywordParam) setKeyword(keywordParam);
    if (optionsParam) setOptions(optionsParam);
    if (keywordParam) fetchResult({ options: optionsParam || [], keyword: keywordParam });
  }, [fetchResult, keywordParam, optionsParam]);

  const handlePressSearch = useCallback(async () => {
    fetchResult({ options, keyword });
  }, [fetchResult, keyword, options]);

  const handlePressSearchHistory = useCallback(
    (history: SearchHistory) => {
      setKeyword(history.keyword);
      setOptions(history.options);
      fetchResult({ options: history.options, keyword: history.keyword });
    },
    [fetchResult],
  );

  // const resetQueryData = useCallback(({keyword, options}: SearchQueryParams => {}, []);

  console.log('useSearchInput', {
    keyword,
    options,
    isFetching,
    searchResult,
  });

  return {
    options,
    setOptions,
    keyword,
    setKeyword,
    handlePressSearch,
    isFetching,
    handlePressSearchHistory,
    searchResult,
    setSearchResult,
  };
}
