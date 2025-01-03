import { useInfiniteQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { DiscountChannels, INFINITE_SEARCH_PAGE_SIZE } from '@/constants';
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
  channelOption: DiscountChannels;
};

const PAGE_SIZE = INFINITE_SEARCH_PAGE_SIZE;

export function useSearchInput({
  addSearchHistory,
  callbackSortChange,
  channelOption,
}: UseSearchInputParams) {
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
    SEARCH_ITEM_SORT_OPTIONS[sortOption].orderDirection,
    channelOption,
    user?.id,
  );

  const { data, isFetching, isLoading, isFetchingNextPage, isSuccess, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey,
      queryFn: ({ pageParam }) => {
        const commonParams = {
          channelOption,
          isOnsale: !!isOnSaleSearch,
          userId: user?.id,
          page: pageParam,
          pageSize: PAGE_SIZE,
          sortField: SEARCH_ITEM_SORT_OPTIONS[sortOption].field,
          sortDirection: SEARCH_ITEM_SORT_OPTIONS[sortOption].orderDirection,
        };

        if (isItemIdSearch) {
          return supabase.items.fullTextSearchItemsByItemId({
            ...commonParams,
            itemId: keywordToSearch,
          });
        }
        return supabase.items.fullTextSearchItemsByKeyword({
          keyword: keywordToSearch,
          ...commonParams,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if ((lastPage.items?.length ?? 0) < PAGE_SIZE) return null;
        return lastPageParam + 1;
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
    handleEndReached,
    sortOption,
    handleSortChange,
    totalResults: data?.pages[0].totalRecords ?? null,
    queryKey,
  };
}
