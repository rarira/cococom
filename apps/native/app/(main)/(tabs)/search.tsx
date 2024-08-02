import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SearchSortBottomSheet from '@/components/custom/bottom-sheet/search-sort';
import SearchResultList from '@/components/custom/list/search-result';
import SearchTextInput from '@/components/custom/text-input/search';
import SearchAccessoriesView from '@/components/custom/view/search/&accessories';
import { useSearchHistory } from '@/hooks/search/useSearchHistory';
import { useSearchInput } from '@/hooks/search/useSearchInput';
import { SearchOptionValue } from '@/libs/search';
import { shadowPresets } from '@/libs/shadow';

export default function SearchScreen() {
  const [options, setOptions] = useState<SearchOptionValue[]>([]);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles, theme } = useStyles(stylesheet);

  const { top } = useSafeAreaInsets();

  const { addSearchHistory, ...restSearchHistoryReturns } = useSearchHistory();

  const {
    isFetching,
    keywordToSearch,
    optionsToSearch,
    setSearchQueryParams,
    handlePressSearchHistory,
    searchResult,
    hasNextPage,
    handleEndReached,
    sortOption,
    handleSortChange,
    totalResults,
  } = useSearchInput({ addSearchHistory });

  useLayoutEffect(() => {
    if (optionsToSearch) setOptions(optionsToSearch);
  }, [optionsToSearch]);

  const isItemIdSearch = useMemo(() => options.includes('item_id'), [options]);
  const tabBarHeight = useBottomTabBarHeight();

  const handlePressSearch = useCallback(
    (keyword: string) => {
      setSearchQueryParams({ keyword, options });
    },
    [options, setSearchQueryParams],
  );

  const handleSortBottomSheetPresent = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <View style={styles.container(top, tabBarHeight)}>
      <Shadow {...shadowPresets.down(theme)} containerStyle={styles.shadowContainer}>
        <View style={styles.searchBox}>
          <SearchTextInput
            placeholder={
              isItemIdSearch ? '상품번호를 숫자로만 입력하세요' : '상품명, 브랜드를 입력하세요'
            }
            disabled={isFetching}
            autoFocus
            onPressSearch={handlePressSearch}
            keywordToSearch={keywordToSearch}
          />
          <SearchAccessoriesView
            checkboxGroupProps={{ value: options, onChange: setOptions as any }}
            searchHistoryProps={{
              ...restSearchHistoryReturns,
              onPressSearchHistory: handlePressSearchHistory,
            }}
          />
        </View>
      </Shadow>
      {searchResult && (
        <View style={styles.resultContainer}>
          <SearchResultList
            searchResult={searchResult}
            searchQueryParams={{ keyword: keywordToSearch, options: optionsToSearch }}
            // hasNextPage={hasNextPage}
            onEndReached={handleEndReached}
            sortOption={sortOption}
            totalResults={totalResults}
            onPressHeaderRightButton={handleSortBottomSheetPresent}
          />
        </View>
      )}
      <SearchSortBottomSheet
        ref={bottomSheetModalRef}
        currentSort={sortOption}
        onSortChange={handleSortChange}
      />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number, tabBarHeight: number) => ({
    flex: 1,
    paddingTop: topInset,
    paddingBottom: tabBarHeight + theme.spacing.lg,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  }),
  shadowContainer: { width: '95%' },
  searchBox: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: `${theme.colors.typography}55`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  resultContainer: {
    flex: 1,
    width: '100%',
  },
}));
