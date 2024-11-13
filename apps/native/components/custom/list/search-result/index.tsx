import { PortalHost } from '@gorhom/portal';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { QueryKey } from '@tanstack/react-query';
import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import LinearProgress from '@/components/core/progress/linear';
import Text from '@/components/core/text';
import DiscountChannelRotateButton from '@/components/custom/button/discount-channel-rotate';
import SearchResultListItemCard from '@/components/custom/card/list-item/search-result';
import { DiscountChannels, PortalHostNames } from '@/constants';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { SearchQueryParams, SearchResultToRender } from '@/libs/search';
import { SEARCH_ITEM_SORT_OPTIONS } from '@/libs/sort';
import SortWithTextButton from '@/components/custom/button/sort-with-text';

interface SearchResultListProps extends Partial<FlashListProps<SearchResultToRender[number]>> {
  searchResult: SearchResultToRender;
  searchQueryParams: SearchQueryParams;
  sortOption: keyof typeof SEARCH_ITEM_SORT_OPTIONS;
  totalResults: number | null;
  onPressHeaderRightButton: () => void;
  queryKey: QueryKey;
  isFetchingNextPage: boolean;
  handleChannelPress: ReturnType<typeof useDiscountRotateButton<DiscountChannels>>['handlePress'];
  channelOption: ReturnType<typeof useDiscountRotateButton<DiscountChannels>>['option'];
}

const SearchResultList = memo(function SearchResultList({
  searchResult,
  searchQueryParams,
  sortOption,
  totalResults,
  onPressHeaderRightButton,
  queryKey,
  isFetchingNextPage,
  channelOption,
  handleChannelPress,
  ...restProps
}: SearchResultListProps) {
  const { styles } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  const renderItem = useCallback(
    ({ item }: { item: SearchResultToRender[number]; index: number }) => {
      return <SearchResultListItemCard key={item.id} item={item} />;
    },
    [],
  );

  const ListHeaderComponent = useMemo(() => {
    if (searchResult.length === 0) return null;

    return (
      <View style={styles.resultHeader}>
        {totalResults ? (
          <Text style={styles.totalResultsText}>{`총 ${totalResults} 개`}</Text>
        ) : (
          <View />
        )}
        <View style={styles.resultHeaderRightContainer}>
          <SortWithTextButton
            text={SEARCH_ITEM_SORT_OPTIONS[sortOption].text}
            onPress={onPressHeaderRightButton}
          />
          <DiscountChannelRotateButton onPress={handleChannelPress} channelOption={channelOption} />
        </View>
      </View>
    );
  }, [
    channelOption,
    handleChannelPress,
    onPressHeaderRightButton,
    searchResult.length,
    sortOption,
    styles.resultHeader,
    styles.resultHeaderRightContainer,
    styles.totalResultsText,
    totalResults,
  ]);

  const ListFooterComponent = useMemo(() => {
    if (!isFetchingNextPage) return null;

    return <LinearProgress />;
  }, [isFetchingNextPage]);

  const ListEmptyComponent = useMemo(() => {
    return <Text style={styles.listEmptyText}>검색 결과가 없습니다</Text>;
  }, [styles.listEmptyText]);

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.seperator} />,
    [styles.seperator],
  );

  return (
    <>
      <FlashList
        data={searchResult}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListFooterComponentStyle={styles.fetchingNextProgress}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={renderItem}
        estimatedItemSize={200}
        keyExtractor={item => item?.id.toString()}
        ItemSeparatorComponent={ItemSeparatorComponent}
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
  seperator: {
    height: theme.spacing.md * 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  resultHeaderRightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
  },
  totalResultsText: {
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
  },
  fetchingNextProgress: {
    marginVertical: theme.spacing.md,
  },
  listEmptyText: {
    fontSize: theme.fontSize.normal,
    alignSelf: 'center',
    marginTop: theme.spacing.xl * 3,
  },
}));

export default SearchResultList;
