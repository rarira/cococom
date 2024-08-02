import { InsertWishlist } from '@cococom/supabase/libs';
import { QueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ListItemWishlistIconButton from '@/components/custom/button/list-item-wishlist-icon';
import DiscountRateText from '@/components/custom/text/discount-rate';
import SuperscriptWonText from '@/components/custom/text/superscript-won';
import Chip from '@/components/ui/chip';
import Divider from '@/components/ui/divider';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { InfiniteSearchResultData, SearchQueryParams, SearchResultToRender } from '@/libs/search';
import { ITEM_SORT_OPTIONS } from '@/libs/sort';
import { useUserStore } from '@/store/user';

interface SearchResultListItemCardDetailViewProps extends SearchQueryParams {
  item: SearchResultToRender[number];
  sortOption: keyof typeof ITEM_SORT_OPTIONS;
}

function SearchResultListItemCardDetailView({
  item,
  keyword,
  options,
  sortOption,
}: SearchResultListItemCardDetailViewProps) {
  const { styles } = useStyles(stylesheets);

  const { user } = useUserStore();

  const isWholeProduct = item.lowestPrice === 0;

  const queryKey = useMemo(() => {
    const isOnSaleNow = options.includes('on_sale');
    const isItemIdSearch = options.includes('item_id');
    return queryKeys.search[isItemIdSearch ? 'itemId' : 'keyword'](
      keyword,
      isOnSaleNow,
      ITEM_SORT_OPTIONS[sortOption].field,
      ITEM_SORT_OPTIONS[sortOption].direction,
      user?.id,
    );
  }, [keyword, options, sortOption, user?.id]);

  const handleMutate = useCallback(
    (queryClient: QueryClient) => async (newWishlist: InsertWishlist) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(
        queryKey,
      ) as unknown as InfiniteSearchResultData;

      const itemIndex = previousData.pages[item.pageIndex].items.findIndex(
        item => item.id === newWishlist.itemId,
      );

      queryClient.setQueryData(queryKey, (old: InfiniteSearchResultData) => {
        if (itemIndex === -1) return old;
        const updatedItem = {
          ...old.pages[item.pageIndex].items[itemIndex],
          totalWishlistCount: item.isWishlistedByUser
            ? item.totalWishlistCount - 1
            : item.totalWishlistCount + 1,
          isWishlistedByUser: !item.isWishlistedByUser,
        };

        const { items, ...restPages } = old.pages[item.pageIndex];

        const updatedPage = {
          ...restPages,
          items: [...items.slice(0, itemIndex), updatedItem, ...items.slice(itemIndex + 1)],
        };

        const { pages, ...restOld } = old;

        return {
          ...restOld,
          pages: [
            ...pages.slice(0, item.pageIndex),
            updatedPage,
            ...pages.slice(item.pageIndex + 1),
          ],
        };
      });

      return { previousData };
    },
    [item.isWishlistedByUser, item.pageIndex, item.totalWishlistCount, queryKey],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.itemNameText} numberOfLines={3}>
        {item.itemName}
      </Text>
      <View style={styles.infoContainer}>
        {isWholeProduct ? (
          <View style={styles.infoBlock}>
            <Text style={styles.discountLabelText}>역대 최대 단위당 할인 금액</Text>
            <SuperscriptWonText price={item.bestDiscount} isMinus />
          </View>
        ) : (
          <>
            <View style={styles.infoBlock}>
              <Text style={styles.discountLabelText}>역대 최대 할인률</Text>
              <DiscountRateText discountRate={item.bestDiscountRate} />
            </View>
            <Divider orientation="vertical" style={styles.infoDivider} />
            <View style={styles.infoBlock}>
              <Text style={styles.discountLabelText}>역대 최저가</Text>
              <SuperscriptWonText price={item.lowestPrice} />
            </View>
          </>
        )}
      </View>
      <View style={styles.actionButtonContainer}>
        {item.isOnSaleNow ? <Chip text="할인 중" /> : <View />}
        {/* <Text style={styles.textStyle}>리뷰: 1000개</Text> */}
        <ListItemWishlistIconButton<SearchResultToRender[number]>
          item={item}
          portalHostName={PortalHostNames.SEARCH}
          queryKey={queryKey}
          onMutate={handleMutate}
        />
      </View>
    </View>
  );
}

const stylesheets = createStyleSheet(theme => ({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  itemNameText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: theme.spacing.sm,
  },
  infoDivider: {
    opacity: 0.2,
    marginHorizontal: theme.spacing.lg,
  },
  infoBlock: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  discountLabelText: {
    color: `${theme.colors.typography}AA`,
    fontSize: theme.fontSize.sm,
  },
  actionButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
}));

export default SearchResultListItemCardDetailView;
