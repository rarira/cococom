import { useCallback, useEffect, useState } from 'react';

import { storage, STORAGE_KEYS } from '@/libs/mmkv';
import { getSearchHistoryHash, SearchHistory, stringifySearchHistory } from '@/libs/search';

export function useSearchHistory(maxHistoryLength = 10) {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);

  useEffect(() => {
    const jsonSearchHistory = storage.getString(STORAGE_KEYS.SEARCH_HISTORY);
    if (jsonSearchHistory) {
      setSearchHistory(JSON.parse(jsonSearchHistory).map((history: string) => JSON.parse(history)));
    }
  }, []);

  const addSearchHistory = useCallback(
    (newHistory: SearchHistory) => {
      const newSearchHistory = Array.from(
        new Set([stringifySearchHistory(newHistory), ...searchHistory.map(stringifySearchHistory)]),
      ).slice(0, maxHistoryLength + 1);

      setSearchHistory(newSearchHistory.map(history => JSON.parse(history)));
      storage.set(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newSearchHistory));
    },
    [maxHistoryLength, searchHistory],
  );

  const clearSearchHistories = useCallback(() => {
    setSearchHistory([]);
    storage.delete(STORAGE_KEYS.SEARCH_HISTORY);
  }, []);

  const removeSearchHistory = useCallback(
    (searchHistoryHash: string) => {
      const newSearchHistory = searchHistory
        .filter(
          history =>
            getSearchHistoryHash({ keyword: history.keyword, options: history.options }) !==
            searchHistoryHash,
        )
        .slice(0, maxHistoryLength);
      setSearchHistory(newSearchHistory);
      storage.set(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newSearchHistory));
    },
    [maxHistoryLength, searchHistory],
  );

  return {
    searchHistory,
    addSearchHistory,
    clearSearchHistories,
    removeSearchHistory,
  };
}
