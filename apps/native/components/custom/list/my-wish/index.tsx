import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { QueryKey } from '@tanstack/react-query';
import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Checkbox from '@/components/core/checkbox';
import LinearProgress from '@/components/core/progress/linear';
import Text from '@/components/core/text';
import HeaderRightButton from '@/components/custom/button/header/right';
import { DiscountChannels } from '@/constants';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { WishlistToRender } from '@/hooks/wishlist/useWishlists';
import { SearchItemsOptions } from '@/libs/search';
import { WISHLIST_SORT_OPTIONS } from '@/libs/sort';

import DiscountChannelRotateButton from '../../button/discount-channel-rotate';
import WishlistItemCard from '../../card/list-item/wishlist';
import SearchOptionCheckbox from '../../checkbox/search-option';

interface MyWishListProps extends Partial<FlashListProps<WishlistToRender[number]>> {
  wishlistResult: WishlistToRender;
  options: string[];
  setOptions: (value: string[]) => void;
  sortOption: keyof typeof WISHLIST_SORT_OPTIONS;
  totalResults: number | null;
  onPressHeaderRightButton: () => void;
  queryKey: QueryKey;
  isFetchingNextPage: boolean;
  handleChannelPress: ReturnType<typeof useDiscountRotateButton<DiscountChannels>>['handlePress'];
  channelOption: ReturnType<typeof useDiscountRotateButton<DiscountChannels>>['option'];
}

const MyWishList = memo(function MyWishList({
  wishlistResult,
  options,
  setOptions,
  sortOption,
  totalResults,
  onPressHeaderRightButton,
  queryKey,
  isFetchingNextPage,
  channelOption,
  handleChannelPress,
  ...restProps
}: MyWishListProps) {
  const { styles } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  const renderItem = useCallback(
    ({ item }: { item: WishlistToRender[number]; index: number }) => {
      return (
        <WishlistItemCard
          key={item.id}
          item={item}
          sortOption={sortOption}
          queryKey={queryKey}
          channelOption={channelOption.value}
          options={options}
        />
      );
    },
    [channelOption.value, options, queryKey, sortOption],
  );

  const ListHeaderComponent = useMemo(() => {
    if (wishlistResult.length === 0) return null;

    return (
      <View style={styles.headerRowContainer}>
        {totalResults ? (
          <Text style={styles.totalResultsText}>{`총 ${totalResults} 개`}</Text>
        ) : (
          <View />
        )}
        <View style={styles.headerRightContainer}>
          <Checkbox.Group value={options} onChange={setOptions}>
            <SearchOptionCheckbox
              option="on_sale"
              value={{
                label: '할인 중인 상품만',
                iconColor: 'white',
              }}
              indicatorStyle={styles.checkboxOnSaleIndicator}
            />
          </Checkbox.Group>
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
    wishlistResult.length,
    styles,
    totalResults,
    options,
    setOptions,
  ]);

  const ListFooterComponent = useMemo(() => {
    if (!isFetchingNextPage) return null;

    return <LinearProgress />;
  }, [isFetchingNextPage]);

  const ListEmptyComponent = useMemo(() => {
    return (
      <Text style={styles.listEmptyText}>
        {`등록된 관심 상품이 없습니다.\n상품 목록 화면에서 하트 모양 아이콘을 눌러\n관심 상품을 등록하세요.`}
      </Text>
    );
  }, [styles.listEmptyText]);

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.seperator} />,
    [styles.seperator],
  );

  return (
    <FlashList
      data={wishlistResult}
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
  );
});

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: (tabBarHeight: number) => ({
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: tabBarHeight + theme.spacing.xl,
  }),
  seperator: {
    height: theme.spacing.md * 2,
  },
  headerRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  headerRightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  checkboxOnSaleIndicator: (checked: boolean) => ({
    backgroundColor: checked ? SearchItemsOptions(theme)['on_sale'].indicatorColor : 'transparent',
    borderColor: checked
      ? SearchItemsOptions(theme)['on_sale'].indicatorColor
      : theme.colors.typography,
  }),
  totalResultsText: {
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
  },
  fetchingNextProgress: {
    marginVertical: theme.spacing.md,
  },
  listEmptyText: {
    fontSize: theme.fontSize.normal,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: theme.spacing.xl * 3,
  },
}));

export default MyWishList;
