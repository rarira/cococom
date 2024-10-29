import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CircularProgress from '@/components/core/progress/circular';
import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import SearchResultList from '@/components/custom/list/search-result';
import SearchTextInput from '@/components/custom/text-input/search';
import ScreenContainerView from '@/components/custom/view/container/screen';
import SearchAccessoriesView from '@/components/custom/view/search/&accessories';
import { DiscountChannels } from '@/constants';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { useSearchHistory } from '@/hooks/search/useSearchHistory';
import { useSearchInput } from '@/hooks/search/useSearchInput';
import { SearchOptionValue } from '@/libs/search';
import { ShadowPresets } from '@/libs/shadow';
import { SEARCH_ITEM_SORT_OPTIONS } from '@/libs/sort';

export default function SearchScreen() {
  const [options, setOptions] = useState<SearchOptionValue[]>([]);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles, theme } = useStyles(stylesheet);

  const { addSearchHistory, ...restSearchHistoryReturns } = useSearchHistory();

  const handleDismissSortBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const { handlePress: handleChannelPress, option: channelOption } =
    useDiscountRotateButton<DiscountChannels>();

  const {
    isFetching,
    keywordToSearch,
    optionsToSearch,
    setSearchQueryParams,
    handlePressSearchHistory,
    searchResult,
    isLoading,
    isFetchingNextPage,
    handleEndReached,
    sortOption,
    handleSortChange,
    totalResults,
    queryKey,
  } = useSearchInput({
    addSearchHistory,
    callbackSortChange: handleDismissSortBottomSheet,
    channelOption: channelOption.value,
  });

  useLayoutEffect(() => {
    if (optionsToSearch) setOptions(optionsToSearch);
  }, [optionsToSearch]);

  const isItemIdSearch = useMemo(() => options.includes('item_id'), [options]);

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
    <ScreenContainerView style={styles.container}>
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
      {isLoading && <CircularProgress style={styles.loadingProgress} />}
      {searchResult && (
        <View style={styles.resultContainer}>
          <SearchResultList
            searchResult={searchResult}
            searchQueryParams={{ keyword: keywordToSearch, options: optionsToSearch }}
            onEndReached={handleEndReached}
            sortOption={sortOption}
            totalResults={totalResults}
            onPressHeaderRightButton={handleSortBottomSheetPresent}
            queryKey={queryKey}
            isFetchingNextPage={isFetchingNextPage}
            handleChannelPress={handleChannelPress}
            channelOption={channelOption}
          />
        </View>
      )}
      <SortBottomSheet
        sortOptions={SEARCH_ITEM_SORT_OPTIONS}
        ref={bottomSheetModalRef}
        currentSort={sortOption}
        onSortChange={handleSortChange}
      />
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  // shadowContainer: { width: '95%' },
  searchBox: {
    width: '95%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: `${theme.colors.typography}55`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...ShadowPresets.down(theme),
  },
  resultContainer: {
    flex: 1,
    width: '100%',
  },
  loadingProgress: {
    marginTop: theme.spacing.xl * 3,
  },
}));
