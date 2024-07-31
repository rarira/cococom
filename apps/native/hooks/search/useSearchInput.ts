import { useCallback, useMemo, useState } from 'react';

import { SearchResult } from '@/components/custom/list/search-result';
import { SearchHistory, SearchOptionValue } from '@/libs/search';
import { supabase } from '@/libs/supabase';

type UseSearchInputParams = {
  addSearchHistory: (searchHistory: SearchHistory) => void;
};

export function useSearchInput({ addSearchHistory }: UseSearchInputParams) {
  const [options, setOptions] = useState<SearchOptionValue[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const isItemIdSearch = useMemo(() => options.includes('item_id'), [options]);

  const placeholder = isItemIdSearch
    ? '상품번호를 숫자로만 입력하세요'
    : '상품명, 브랜드를 입력하세요';

  const fetchResult = useCallback(
    async (options: SearchOptionValue[], keyword: string) => {
      const isOnSaleSearch = options.includes('on_sale');
      const isItemIdSearch = options.includes('item_id');

      console.log('call fetchResult', { isItemIdSearch, keyword, options });
      let fetchFn;
      if (isItemIdSearch) {
        fetchFn = supabase.fullTextSearchItemsByItemId(keyword, isOnSaleSearch);
      } else {
        fetchFn = supabase.fullTextSearchItemsByKeyworkd(keyword, isOnSaleSearch);
      }
      setIsFetching(true);
      try {
        const data = await fetchFn;
        setSearchResult(data);
        addSearchHistory({ keyword, options });
        setKeyword('');
      } catch (error) {
        console.error(error);
        setSearchResult(null);
      }
      setIsFetching(false);
    },
    [addSearchHistory],
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
    placeholder,
    handlePressSearch,
    isFetching,
    handlePressSearchHistory,
    searchResult,
  };
}
