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
import HeaderRightButton from '@/components/custom/button/header/right';
import SearchResultListItemCard from '@/components/custom/card/list-item/search-result';
import { DiscountChannels, DiscountRotateButtonOptions, PortalHostNames } from '@/constants';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { SearchQueryParams, SearchResultToRender } from '@/libs/search';
import { SEARCH_ITEM_SORT_OPTIONS } from '@/libs/sort';

interface SearchResultListProps extends Partial<FlashListProps<SearchResultToRender[number]>> {
  searchResult: SearchResultToRender;
  searchQueryParams: SearchQueryParams;
  sortOption: keyof typeof SEARCH_ITEM_SORT_OPTIONS;
  totalResults: number | null;
  onPressHeaderRightButton: () => void;
  queryKey: QueryKey;
  isFetchingNextPage: boolean;
}

const SearchResultList = memo(function SearchResultList({
  searchResult,
  searchQueryParams,
  sortOption,
  totalResults,
  onPressHeaderRightButton,
  queryKey,
  isFetchingNextPage,
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
          queryKey={queryKey}
          {...searchQueryParams}
        />
      );
    },
    [queryKey, searchQueryParams, sortOption],
  );

  const { handlePress: handleChannelPress, option: channelOption } =
    useDiscountRotateButton<DiscountChannels>(DiscountRotateButtonOptions);

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
          <HeaderRightButton
            iconProps={{ font: { type: 'MaterialIcon', name: 'sort' } }}
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

  const searchResultByChannel = useMemo(() => {
    return searchResult.filter(result => {
      if (channelOption.value === DiscountChannels.ALL) return true;
      if (channelOption.value === DiscountChannels.ONLINE) return result.is_online;
      return !result.is_online;
    });
  }, [searchResult, channelOption]);

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.seperator} />,
    [styles.seperator],
  );

  return (
    <>
      <FlashList
        data={searchResultByChannel}
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
    width: '100%',
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
