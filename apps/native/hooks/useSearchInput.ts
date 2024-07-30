import { useQuery } from '@tanstack/react-query';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';

export function useSearchInput() {
  const [options, setOptions] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  const isItemIdSearch = useMemo(() => options.includes('product_number'), [options]);
  const isOnSaleSearch = useMemo(() => options.includes('on_sale'), [options]);

  const placeholder = isItemIdSearch
    ? '상품번호를 숫자로만 입력하세요'
    : '상품명, 브랜드를 입력하세요';

  const {
    data: searchResult,
    isError,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: isItemIdSearch ? queryKeys.search.itemId(keyword) : queryKeys.search.keyword(keyword),
    queryFn: () => {
      if (isItemIdSearch) {
        return supabase.fullTextSearchItemsByItemId(keyword, isOnSaleSearch);
      }
      return supabase.fullTextSearchItemsByKeyworkd(keyword, isOnSaleSearch);
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });

  useLayoutEffect(() => {
    if (isFetched && !isError) {
      setKeyword('');
    }
  }, [isError, isFetched]);

  const handlePressSearch = useCallback(async () => {
    console.log('call handlePressSearch');
    refetch();
  }, [refetch]);

  console.log('useSearchInput', { isFetching, isFetched, isError, searchResult });

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
