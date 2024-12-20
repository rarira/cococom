import { useCallback } from 'react';
import { useMMKVObject } from 'react-native-mmkv';

import { storage, STORAGE_KEYS } from '@/libs/mmkv';
import { getSearchHistoryHash, SearchHistory, stringifySearchHistory } from '@/libs/search';

export function useSearchHistory(maxHistoryLength = 10) {
  const [searchHistory, setSearchHistory] = useMMKVObject<SearchHistory[]>(
    STORAGE_KEYS.SEARCH_HISTORY,
  );

  const addSearchHistory = useCallback(
    (newHistory: SearchHistory) => {
      const newSearchHistory = Array.from(
        new Set([
          stringifySearchHistory(newHistory),
          ...(searchHistory ?? []).map(stringifySearchHistory),
        ]),
      )
        .slice(0, maxHistoryLength + 1)
        .map(history => JSON.parse(history) as SearchHistory);

      setSearchHistory(newSearchHistory);
      storage.set(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newSearchHistory));
    },
    [maxHistoryLength, searchHistory, setSearchHistory],
  );

  const clearSearchHistories = useCallback(() => {
    setSearchHistory([]);
    storage.delete(STORAGE_KEYS.SEARCH_HISTORY);
  }, []);

  const removeSearchHistory = useCallback(
    (searchHistoryHash: string) => {
      const newSearchHistory = (searchHistory ?? [])
        .filter(
          history =>
            getSearchHistoryHash({ keyword: history.keyword, options: history.options }) !==
            searchHistoryHash,
        )
        .slice(0, maxHistoryLength);
      setSearchHistory(newSearchHistory);
    },
    [maxHistoryLength, searchHistory, setSearchHistory],
  );

  return {
    searchHistory,
    addSearchHistory,
    clearSearchHistories,
    removeSearchHistory,
  };
}
