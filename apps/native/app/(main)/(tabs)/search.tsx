import { useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SearchResultList from '@/components/custom/list/search-result';
import SearchTextInput from '@/components/custom/text-input/search';
import SearchHistoryView from '@/components/custom/view/search-history';
import Checkbox from '@/components/ui/checkbox';
import Text from '@/components/ui/text';
import { useSearchHistory } from '@/hooks/search/useSearchHistory';
import { useSearchInput } from '@/hooks/search/useSearchInput';
import { SearchItemOptionInfo, SearchItemsOptions, SearchOptionValue } from '@/libs/search';

interface SearchScreenProps {}

export default function SearchScreen({}: SearchScreenProps) {
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
  } = useSearchInput({ addSearchHistory });

  const isItemIdSearch = useMemo(() => options.includes('item_id'), [options]);

  const SearchItemCheckbox = useMemo(() => {
    const searchItemsOptions = Object.entries(SearchItemsOptions(theme)) as [
      SearchOptionValue,
      SearchItemOptionInfo,
    ][];

    return (
      <>
        {searchItemsOptions.map(([key, value], index) => (
          <Checkbox.Root key={key} value={key}>
            <Checkbox.Indicator
              style={
                key === 'item_id'
                  ? styles.checkboxProductNumberIndicator
                  : styles.checkboxOnSaleIndicator
              }
            >
              <Checkbox.Icon color={value.iconColor} />
            </Checkbox.Indicator>
            <Checkbox.Label>{value.label}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </>
    );
  }, [styles.checkboxOnSaleIndicator, styles.checkboxProductNumberIndicator, theme]);

  return (
    <View style={styles.container(top)}>
      <Text>Search</Text>
      <SearchTextInput
        value={keyword}
        onChangeText={setKeyword}
        placeholder={
          isItemIdSearch ? '상품번호를 숫자로만 입력하세요' : '상품명, 브랜드를 입력하세요'
        }
        onPressSearch={handlePressSearch}
        disabled={isFetching}
      />
      <Checkbox.Group value={options} onChange={setOptions as any} style={styles.checkboxGroup}>
        {SearchItemCheckbox}
      </Checkbox.Group>
      <SearchHistoryView
        onPressSearchHistory={handlePressSearchHistory}
        {...restSearchHistoryReturns}
      />
      {searchResult && <SearchResultList searchResult={searchResult} />}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number) => ({
    flex: 1,
    paddingTop: topInset,
    paddingHorizontal: theme.screenHorizontalPadding,
    backgroundColor: theme.colors.background,
  }),
  checkboxGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  checkboxProductNumberIndicator: (checked: boolean) => ({
    backgroundColor: checked ? SearchItemsOptions(theme)['item_id'].indicatorColor : 'transparent',
    borderColor: checked
      ? SearchItemsOptions(theme)['item_id'].indicatorColor
      : theme.colors.typography,
  }),
  checkboxOnSaleIndicator: (checked: boolean) => ({
    backgroundColor: checked ? SearchItemsOptions(theme)['on_sale'].indicatorColor : 'transparent',
    borderColor: checked
      ? SearchItemsOptions(theme)['on_sale'].indicatorColor
      : theme.colors.typography,
  }),
}));
