import { PortalHost } from '@gorhom/portal';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SearchResultListItemCard from '@/components/custom/card/list-item/search-result';
import { PortalHostNames } from '@/constants';
import { SearchQueryParams, SearchResultToRender } from '@/libs/search';

interface SearchResultListProps extends Partial<FlashListProps<SearchResult[number]>> {
  searchResult: SearchResultToRender;
  searchQueryParams: SearchQueryParams;
}

const SearchResultList = memo(function SearchResultList({
  searchResult,
  searchQueryParams,
  ...restProps
}: SearchResultListProps) {
  const { styles } = useStyles(stylesheet);

  const renderItem = useCallback(
    ({ item }: { item: SearchResultToRender[number]; index: number }) => {
      return <SearchResultListItemCard item={item} key={item.id} {...searchQueryParams} />;
    },
    [searchQueryParams],
  );

  return (
    <>
      <FlashList
        data={searchResult}
        renderItem={renderItem}
        estimatedItemSize={200}
        keyExtractor={item => item?.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
        contentContainerStyle={styles.flashListContainer}
        onEndReachedThreshold={0.5}
        {...restProps}
      />
      <PortalHost name={PortalHostNames.SEARCH} />
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: {
    paddingTop: theme.spacing.lg * 1.5,
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
}));

export default SearchResultList;
