import { useCallback, useState } from 'react';

import { supabase } from '@/libs/supabase';

export function useSearchInput() {
  const [options, setOptions] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  const placeholder = options.includes('product_number')
    ? '상품번호를 숫자로만 입력하세요'
    : '상품명, 브랜드를 입력하세요';

  const handlePressSearch = useCallback(async () => {
    const result = await supabase.fullTextSearchItems(keyword);
    console.log('search Result', { result });
  }, [keyword]);

  return {
    options,
    setOptions,
    keyword,
    setKeyword,
    placeholder,
    handlePressSearch,
  };
}
