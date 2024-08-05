import { PortalHost } from '@gorhom/portal';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import HeaderRightButton from '@/components/custom/button/header-right';
import SearchResultListItemCard from '@/components/custom/card/list-item/search-result';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';
import { SearchQueryParams, SearchResultToRender } from '@/libs/search';
import { ITEM_SORT_OPTIONS } from '@/libs/sort';

interface SearchResultListProps extends Partial<FlashListProps<SearchResultToRender[number]>> {
  searchResult: SearchResultToRender;
  searchQueryParams: SearchQueryParams;
  sortOption: keyof typeof ITEM_SORT_OPTIONS;
  totalResults: number | null;
  onPressHeaderRightButton: () => void;
}

const SearchResultList = memo(function SearchResultList({
  searchResult,
  searchQueryParams,
  sortOption,
  totalResults,
  onPressHeaderRightButton,
  ...restProps
}: SearchResultListProps) {
  const { styles } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  const renderItem = useCallback(
    ({ item }: { item: SearchResultToRender[number]; index: number }) => {
      return (
        <SearchResultListItemCard
          key={item.id}
          item={item}
          sortOption={sortOption}
          {...searchQueryParams}
        />
      );
    },
    [searchQueryParams, sortOption],
  );

  const ListHeaderComponent = useCallback(() => {
    if (searchResult.length === 0) return null;

    return (
      <View style={styles.resultHeader}>
        {totalResults ? (
          <Text style={styles.totalResultsText}>{`총 ${totalResults} 개`}</Text>
        ) : (
          <View />
        )}
        <HeaderRightButton
          iconProps={{ font: { type: 'MaterialIcon', name: 'sort' } }}
          onPress={onPressHeaderRightButton}
        />
      </View>
    );
  }, [
    onPressHeaderRightButton,
    searchResult.length,
    styles.resultHeader,
    styles.totalResultsText,
    totalResults,
  ]);

  return (
    <>
      <FlashList
        data={searchResult}
        ListHeaderComponent={ListHeaderComponent}
        renderItem={renderItem}
        estimatedItemSize={200}
        keyExtractor={item => item?.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
        contentContainerStyle={styles.flashListContainer(tabBarHeight)}
        onEndReachedThreshold={0.5}
        {...restProps}
      />
      <PortalHost name={PortalHostNames.SEARCH} />
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: (tabBarHeight: number) => ({
    paddingTop: theme.spacing.lg * 1.5,
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingBottom: tabBarHeight + theme.spacing.xl,
  }),
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
  resultHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  totalResultsText: {
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
  },
}));

export default SearchResultList;
