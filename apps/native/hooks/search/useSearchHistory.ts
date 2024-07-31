import { useCallback, useEffect, useState } from 'react';

import { storage, STORAGE_KEYS } from '@/libs/mmkv';

export function useSearchHistory(maxHistoryLength = 10) {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const jsonSearchHistory = storage.getString(STORAGE_KEYS.SEARCH_HISTORY);
    if (jsonSearchHistory) {
      setSearchHistory(JSON.parse(jsonSearchHistory));
    }
  }, []);

  const addSearchHistory = useCallback(
    (keyword: string) => {
      const newSearchHistory = Array.from(new Set([keyword, ...searchHistory])).slice(
        0,
        maxHistoryLength,
      );
      setSearchHistory(newSearchHistory);
      storage.set(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newSearchHistory));
    },
    [maxHistoryLength, searchHistory],
  );

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    storage.delete(STORAGE_KEYS.SEARCH_HISTORY);
  }, []);

  return {
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
  };
}
