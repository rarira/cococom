import { useCallback, useEffect, useState } from 'react';

import { storage, STORAGE_KEYS } from '@/libs/mmkv';
import { SearchHistory } from '@/libs/search';
import Util from '@/libs/util';

export function useSearchHistory(maxHistoryLength = 10) {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);

  useEffect(() => {
    const jsonSearchHistory = storage.getString(STORAGE_KEYS.SEARCH_HISTORY);
    if (jsonSearchHistory) {
      setSearchHistory(JSON.parse(jsonSearchHistory).map(JSON.parse));
    }
  }, []);

  const addSearchHistory = useCallback(
    (newHistory: SearchHistory) => {
      const newSearchHistory = Array.from(
        new Set([
          Util.stringifySearchHistory(newHistory),
          ...searchHistory.map(Util.stringifySearchHistory),
        ]),
      ).slice(0, maxHistoryLength + 1);
      setSearchHistory(newSearchHistory.map(history => JSON.parse(history)));
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
