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
import { SEARCH_ITEM_SORT_OPTIONS } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

type UseSearchInputParams = {
  addSearchHistory: (searchHistory: SearchHistory) => void;
  callbackSortChange?: (sortOption: keyof typeof SEARCH_ITEM_SORT_OPTIONS) => void;
};

const PAGE_SIZE = 10;

export function useSearchInput({ addSearchHistory, callbackSortChange }: UseSearchInputParams) {
  const [optionsToSearch, setOptionsToSearch] = useState<SearchOptionValue[]>([]);
  const [keywordToSearch, setKeywordToSearch] = useState<string>('');
  const [sortOption, setSortOption] =
    useState<keyof typeof SEARCH_ITEM_SORT_OPTIONS>('itemNameAsc');

  const user = useUserStore(store => store.user);

  const {
    keyword: keywordParam,
    options: optionsParam,
    sortOption: sortOptionParam,
  } = useLocalSearchParams<{
    keyword: string;
    options: SearchOptionValue[];
    sortOption: keyof typeof SEARCH_ITEM_SORT_OPTIONS;
  }>();

  // TODO : 테스트 필요
  useLayoutEffect(() => {
    if (keywordParam) setKeywordToSearch(keywordParam);
    if (optionsParam) setOptionsToSearch(optionsParam);
    if (sortOptionParam) {
      setSortOption(sortOptionParam);
    }
  }, [keywordParam, optionsParam, sortOptionParam]);

  const isOnSaleSearch = optionsToSearch.includes('on_sale');
  const isItemIdSearch = optionsToSearch.includes('item_id');

  const queryKey = queryKeys.search[isItemIdSearch ? 'itemId' : 'keyword'](
    keywordToSearch,
    isOnSaleSearch,
    SEARCH_ITEM_SORT_OPTIONS[sortOption].field,
    SEARCH_ITEM_SORT_OPTIONS[sortOption].direction,
    user?.id,
  );

  const { data, isFetching, isLoading, isFetchingNextPage, isSuccess, fetchNextPage, hasNextPage } =
    useInfiniteQuery<InfiniteSearchResultPages>({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey,
      queryFn: ({ pageParam }) => {
        if (isItemIdSearch) {
          return supabase.fullTextSearchItemsByItemId(
            keywordToSearch,
            !!isOnSaleSearch,
            user?.id,
            pageParam as number,
            PAGE_SIZE,
            SEARCH_ITEM_SORT_OPTIONS[sortOption].field,
            SEARCH_ITEM_SORT_OPTIONS[sortOption].direction,
          );
        }
        return supabase.fullTextSearchItemsByKeyword(
          keywordToSearch,
          !!isOnSaleSearch,
          user?.id,
          pageParam as number,
          PAGE_SIZE,
          SEARCH_ITEM_SORT_OPTIONS[sortOption].field,
          SEARCH_ITEM_SORT_OPTIONS[sortOption].direction,
        );
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if ((lastPage.items?.length ?? 0) < PAGE_SIZE) return undefined;
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

  const handleSortChange = useCallback(
    (sortOption: keyof typeof SEARCH_ITEM_SORT_OPTIONS) => {
      setSortOption(sortOption);
      callbackSortChange?.(sortOption);
    },
    [callbackSortChange],
  );

  // NOTE: DEBUG
  // console.log('useSearchInput', {
  //   keywordToSearch,
  //   optionsToSearch,
  //   isFetching,
  //   isSuccess,
  //   pages: data?.pages,
  //   hasNextPage,
  //   pagaParams: data?.pageParams,
  //   totalResults: data?.pages[0].totalRecords,
  // });

  const searchResult: SearchResultToRender = useMemo(
    () =>
      data?.pages.flatMap(
        (page, index) => page.items?.map(item => ({ ...item, pageIndex: index })) ?? [],
      ) ?? [],
    [data?.pages],
  );

  return {
    keywordToSearch,
    optionsToSearch,
    setKeywordToSearch,
    setOptionsToSearch,
    setSearchQueryParams,
    isLoading,
    isFetching,
    isFetchingNextPage,
    handlePressSearchHistory,
    searchResult,
    hasNextPage,
    handleEndReached,
    sortOption,
    handleSortChange,
    totalResults: data?.pages[0].totalRecords ?? null,
    queryKey,
  };
}
