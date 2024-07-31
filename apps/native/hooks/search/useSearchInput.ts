import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { SearchResult } from '@/components/custom/list/search-result';
import { queryKeys } from '@/libs/react-query';
import { SearchHistory, SearchOptionValue } from '@/libs/search';
import { supabase } from '@/libs/supabase';

type UseSearchInputParams = {
  addSearchHistory: (searchHistory: SearchHistory) => void;
};

export function useSearchInput({ addSearchHistory }: UseSearchInputParams) {
  const [options, setOptions] = useState<SearchOptionValue[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const queryClient = useQueryClient();

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchResult = useCallback(
    async (options: SearchOptionValue[], keyword: string) => {
      const isOnSaleSearch = options.includes('on_sale');
      const isItemIdSearch = options.includes('item_id');

      console.log('call fetchResult', { isItemIdSearch, keyword, options });
      let queryFn;
      if (isItemIdSearch) {
        queryFn = () => supabase.fullTextSearchItemsByItemId(keyword, isOnSaleSearch);
      } else {
        queryFn = () => supabase.fullTextSearchItemsByKeyworkd(keyword, isOnSaleSearch);
      }
      setIsFetching(true);
      try {
        const data = await queryClient.fetchQuery({
          queryKey: queryKeys.search[isItemIdSearch ? 'itemId' : 'keyword'](
            keyword,
            isOnSaleSearch,
          ),
          queryFn,
        });
        setSearchResult(data);
        addSearchHistory({ keyword, options });
      } catch (error) {
        console.error(error);
        setSearchResult(null);
      }
      setIsFetching(false);
    },
    [addSearchHistory, queryClient],
  );

  const handlePressSearch = useCallback(async () => {
    fetchResult(options, keyword);
  }, [fetchResult, keyword, options]);

  const handlePressSearchHistory = useCallback(
    (history: SearchHistory) => {
      console.log('handlePressSearchHistory', history);
      setKeyword(history.keyword);
      setOptions(history.options);
      fetchResult(history.options, history.keyword);
    },
    [fetchResult],
  );

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
  };
}
