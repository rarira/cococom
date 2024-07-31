import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';

import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';

type UseSearchInputParams = {
  addSearchHistory: (keyword: string) => void;
};

export function useSearchInput({ addSearchHistory }: UseSearchInputParams) {
  const [options, setOptions] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  const isItemIdSearch = useMemo(() => options.includes('product_number'), [options]);
  const isOnSaleSearch = useMemo(() => options.includes('on_sale'), [options]);

  const searchKeywordRef = useRef<string>('');

  const placeholder = isItemIdSearch
    ? '상품번호를 숫자로만 입력하세요'
    : '상품명, 브랜드를 입력하세요';

  const { data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: isItemIdSearch
      ? queryKeys.search.itemId(searchKeywordRef.current)
      : queryKeys.search.keyword(searchKeywordRef.current),
    queryFn: () => {
      try {
        let result;
        if (isItemIdSearch) {
          result = supabase.fullTextSearchItemsByItemId(searchKeywordRef.current, isOnSaleSearch);
        } else {
          result = supabase.fullTextSearchItemsByKeyworkd(searchKeywordRef.current, isOnSaleSearch);
        }
        addSearchHistory(searchKeywordRef.current);
        searchKeywordRef.current = '';
        return result;
      } catch (error) {
        console.error(error);
      }
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const handlePressSearch = useCallback(async () => {
    console.log('call handlePressSearch');
    searchKeywordRef.current = keyword;
    refetch();
  }, [refetch, keyword]);

  console.log('useSearchInput', { isFetching, isSuccess, data });

  return {
    options,
    setOptions,
    keyword,
    setKeyword,
    placeholder,
    handlePressSearch,
    isFetching,
  };
}
