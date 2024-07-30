import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';

export function useSearchInput() {
  const [options, setOptions] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  const placeholder = options.includes('product_number')
    ? '상품번호를 숫자로만 입력하세요'
    : '상품명, 브랜드를 입력하세요';

  const {
    data: searchResult,
    isError,
    isLoading,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: queryKeys.search.keyword(keyword),
    queryFn: () => supabase.fullTextSearchItems(keyword),
    enabled: false,
    refetchOnWindowFocus: false,
  });

  console.log('searchResult', isFetched, searchResult);
  const handlePressSearch = useCallback(async () => {
    refetch();
  }, [refetch]);

  return {
    options,
    setOptions,
    keyword,
    setKeyword,
    placeholder,
    handlePressSearch,
  };
}
