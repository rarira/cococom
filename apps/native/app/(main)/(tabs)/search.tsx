import { useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SearchResultList from '@/components/custom/list/search-result';
import SearchTextInput from '@/components/custom/text-input/search';
import SearchAccessoriesView from '@/components/custom/view/search/&accessories';
import { useSearchHistory } from '@/hooks/search/useSearchHistory';
import { useSearchInput } from '@/hooks/search/useSearchInput';
import { shadowPresets } from '@/libs/shadow';

export default function SearchScreen() {
  const { styles, theme } = useStyles(stylesheet);

  const { top } = useSafeAreaInsets();

  const { addSearchHistory, ...restSearchHistoryReturns } = useSearchHistory();

  const {
    options,
    setOptions,
    isFetching,
    keyword,
    setKeyword,
    handlePressSearch,
    handlePressSearchHistory,
    searchResult,
    setSearchResult,
  } = useSearchInput({ addSearchHistory });

  const isItemIdSearch = useMemo(() => options.includes('item_id'), [options]);

  return (
    <View style={styles.container(top)}>
      <Shadow {...shadowPresets.down(theme)} containerStyle={styles.shadowContainer}>
        <View style={styles.searchBox}>
          <SearchTextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder={
              isItemIdSearch ? '상품번호를 숫자로만 입력하세요' : '상품명, 브랜드를 입력하세요'
            }
            onPressSearch={handlePressSearch}
            disabled={isFetching}
            autoFocus
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
            keyword={keyword}
            options={options}
            setSearchResult={setSearchResult}
          />
        </View>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number) => ({
    flex: 1,
    paddingTop: topInset,
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
