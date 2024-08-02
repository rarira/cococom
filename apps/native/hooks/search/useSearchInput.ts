import { InfiniteSearchResultPages } from '@cococom/supabase/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { queryKeys } from '@/libs/react-query';
import {
  getSearchHistoryHash,
  SearchHistory,
  SearchOptionValue,
  SearchQueryParams,
  SearchResultToRender,
} from '@/libs/search';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

type UseSearchInputParams = {
  addSearchHistory: (searchHistory: SearchHistory) => void;
};

const PAGE_SIZE = 10;

export function useSearchInput({ addSearchHistory }: UseSearchInputParams) {
  const [optionsToSearch, setOptionsToSearch] = useState<SearchOptionValue[]>([]);
  const [keywordToSearch, setKeywordToSearch] = useState<string>('');
  // const [totalResults, setTotalResults] = useState<number | null>(null);

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

  const { data, isFetching, isSuccess, isError, fetchNextPage, hasNextPage, fetchPreviousPage } =
    useInfiniteQuery<InfiniteSearchResultPages>({
      queryKey: queryKeys.search[isItemIdSearch ? 'itemId' : 'keyword'](
        keywordToSearch,
        isOnSaleSearch,
        user?.id,
      ),
      queryFn: ({ pageParam }) => {
        if (isItemIdSearch) {
          return supabase.fullTextSearchItemsByItemId(
            keywordToSearch,
            isOnSaleSearch,
            user?.id,
            pageParam as number,
            PAGE_SIZE,
          );
        }
        return supabase.fullTextSearchItemsByKeyword(
          keywordToSearch,
          isOnSaleSearch,
          user?.id,
          pageParam as number,
          PAGE_SIZE,
        );
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.items.length < PAGE_SIZE) return undefined;
        return allPages.length + 1;
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

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  console.log('useSearchInput', {
    keywordToSearch,
    optionsToSearch,
    isFetching,
    isSuccess,
    pages: data?.pages,
    hasNextPage,
    pagaParams: data?.pageParams,
    totalResults: data?.pages[0].totalRecords,
  });

  const searchResult: SearchResultToRender = useMemo(
    () =>
      data?.pages
        .map((page, index) => page.items.map(item => ({ ...item, pageIndex: index })))
        .flat() ?? [],
    [data?.pages],
  );

  return {
    keywordToSearch,
    optionsToSearch,
    setKeywordToSearch,
    setOptionsToSearch,
    setSearchQueryParams,
    isFetching,
    handlePressSearchHistory,
    searchResult,
    hasNextPage,
    handleEndReached,
    totalResults: data?.pages[0].totalRecords ?? null,
  };
}
