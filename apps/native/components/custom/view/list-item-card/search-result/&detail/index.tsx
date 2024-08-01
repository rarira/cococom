import { InsertWishlist } from '@cococom/supabase/libs';
import { QueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ListItemWishlistIconButton from '@/components/custom/button/list-item-wishlist-icon';
import { SearchResult } from '@/components/custom/list/search-result';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { SearchQueryParams } from '@/libs/search';
import { useUserStore } from '@/store/user';

interface SearchResultListItemCardDetailViewProps extends SearchQueryParams {
  item: SearchResult[number];
  setSearchResult: (searchResult: SearchResult) => void;
}

function SearchResultListItemCardDetailView({
  item,
  keyword,
  options,
  setSearchResult,
}: SearchResultListItemCardDetailViewProps) {
  const { styles } = useStyles(stylesheets);

  const { user } = useUserStore();

  const isWholeProduct = item.lowestPrice === 0;

  const queryKey = useMemo(() => {
    const isOnSaleNow = options.includes('on_sale');
    const isItemIdSearch = options.includes('item_id');
    return queryKeys.search[isItemIdSearch ? 'itemId' : 'keyword'](keyword, isOnSaleNow, user?.id);
  }, [keyword, options, user?.id]);

  const handleMutate = useCallback(
    (queryClient: QueryClient) => async (newWishlist: InsertWishlist) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey) as unknown as SearchResult;

      const index = previousData?.findIndex(item => item.id === newWishlist.itemId);

      queryClient.setQueryData(queryKey, (old: SearchResult) => {
        if (index === -1) return old;
        const updatedItem = {
          ...old[index],
          totalWishlistCount: item.isWishlistedByUser
            ? item.totalWishlistCount - 1
            : item.totalWishlistCount + 1,
          isWishlistedByUser: !item.isWishlistedByUser,
        };

        const newSearchResult = [...old.slice(0, index), updatedItem, ...old.slice(index + 1)];
        setSearchResult(newSearchResult);

        return newSearchResult;
      });

      return { previousData };
    },
    [item.isWishlistedByUser, item.totalWishlistCount, queryKey, setSearchResult],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.itemNameText} numberOfLines={3}>
        {item.itemName}
      </Text>
      <View>
        {/* <View style={styles.priceContainer}>
          {isWholeProduct ? null : (
            <>
              <Text
                style={styles.regularPriceText}
              >{`\u20A9${Util.toWonString(discount.price)}`}</Text>
              <DiscountRateText discountRate={discount.discountRate!} />
            </>
          )}
          <SuperscriptWonText
            price={discount[isWholeProduct ? 'discount' : 'discountPrice']}
            isMinus={isWholeProduct}
          />
        </View>
        <View style={styles.miscInfoContainer}>
          <ListItemCardChipsView discount={discount} />
          <DiscountPeriodText startDate={discount.startDate} endDate={discount.endDate} />
        </View> */}
        <View style={styles.actionButtonContainer}>
          {/* <Text style={styles.textStyle}>리뷰: 1000개</Text> */}
          <ListItemWishlistIconButton<SearchResult[number]>
            item={item}
            portalHostName={PortalHostNames.SEARCH}
            queryKey={queryKey}
            onMutate={handleMutate}
          />
        </View>
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
    lineHeight: 16,
    fontWeight: 'semibold',
  },
  priceContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginVertical: theme.spacing.md,
  },
  regularPriceText: {
    fontSize: theme.fontSize.xs,
    lineHeight: theme.fontSize.xs,
    textDecorationLine: 'line-through',
    opacity: 0.8,
    marginEnd: theme.spacing.sm,
  },
  miscInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
}));

export default SearchResultListItemCardDetailView;
