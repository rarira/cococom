import { useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types';

import SearchTextInput from '@/components/custom/text-input/search';
import SearchHistoryView from '@/components/custom/view/search-history';
import Checkbox from '@/components/ui/checkbox';
import Text from '@/components/ui/text';
import { useSearchHistory } from '@/hooks/search/useSearchHistory';
import { useSearchInput } from '@/hooks/search/useSearchInput';

interface SearchScreenProps {}

export type SearchOptionValue = 'item_id' | 'on_sale';

type SearchItemOptionInfo = {
  label: string;
  indicatorColor: string;
  iconColor: string;
};

export const SearchItemsOptions = (
  theme: UnistylesTheme,
): Record<SearchOptionValue, SearchItemOptionInfo> => ({
  item_id: {
    label: '상품번호로 검색',
    indicatorColor: theme.colors.tint,
    iconColor: theme.colors.background,
  },
  on_sale: {
    label: '할인 중인 상품만',
    indicatorColor: theme.colors.alert,
    iconColor: 'white',
  },
});

export default function SearchScreen({}: SearchScreenProps) {
  const { styles, theme } = useStyles(stylesheet);

  const { top } = useSafeAreaInsets();

  const { searchHistory, addSearchHistory, clearSearchHistory } = useSearchHistory();

  const {
    options,
    setOptions,
    isFetching,
    keyword,
    setKeyword,
    placeholder,
    handlePressSearch,
    handlePressSearchHistory,
  } = useSearchInput({ addSearchHistory });

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
        placeholder={placeholder}
        onPressSearch={handlePressSearch}
        disabled={isFetching}
      />
      <Checkbox.Group value={options} onChange={setOptions} style={styles.checkboxGroup}>
        {SearchItemCheckbox}
      </Checkbox.Group>
      <SearchHistoryView
        searchHistory={searchHistory}
        onPressSearchHistory={handlePressSearchHistory}
      />
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
