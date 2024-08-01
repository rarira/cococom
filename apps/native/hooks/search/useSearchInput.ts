import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

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
  const [optionsToSearch, setOptionsToSearch] = useState<SearchOptionValue[]>([]);
  const [keywordToSearch, setKeywordToSearch] = useState<string>('');

  const { user } = useUserStore();

  const { keyword: keywordParam, options: optionsParam } = useLocalSearchParams<{
    keyword: string;
    options: SearchOptionValue[];
  }>();

  // TODO : 테스트 필요
  useLayoutEffect(() => {
    if (keywordParam) setKeywordToSearch(keywordParam);
    if (optionsParam) setOptionsToSearch(optionsParam);
  }, [keywordParam, optionsParam]);

  const isOnSaleSearch = optionsToSearch.includes('on_sale');
  const isItemIdSearch = optionsToSearch.includes('item_id');

  const {
    data: searchResult,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: queryKeys.search[isItemIdSearch ? 'itemId' : 'keyword'](
      keywordToSearch,
      isOnSaleSearch,
      user?.id,
    ),
    queryFn: () => {
      if (isItemIdSearch) {
        return supabase.fullTextSearchItemsByItemId(keywordToSearch, isOnSaleSearch, user?.id);
      }
      return supabase.fullTextSearchItemsByKeyworkd(keywordToSearch, isOnSaleSearch, user?.id);
    },
    enabled: !!keywordToSearch,
  });

  useEffect(() => {
    if (isSuccess) {
      addSearchHistory({
        keyword: keywordToSearch,
        options: optionsToSearch,
        hash: getSearchHistoryHash({ keyword: keywordToSearch, options: optionsToSearch }),
      });
    }
    // NOTE: 무한 업데이트 방지하기 위해 eslint-disable-next-line 추가
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, keywordToSearch, optionsToSearch]);

  const setSearchQueryParams = useCallback(async ({ keyword, options }: SearchQueryParams) => {
    setKeywordToSearch(keyword);
    setOptionsToSearch(options);
  }, []);

  const handlePressSearchHistory = useCallback((history: SearchHistory) => {
    setKeywordToSearch(history.keyword);
    setOptionsToSearch(history.options);
  }, []);

  console.log('useSearchInput', {
    keywordToSearch,
    optionsToSearch,
    isFetching,
    isSuccess,
    searchResult,
  });

  return {
    keywordToSearch,
    optionsToSearch,
    setKeywordToSearch,
    setOptionsToSearch,
    setSearchQueryParams,
    isFetching,
    handlePressSearchHistory,
    searchResult,
  };
}
