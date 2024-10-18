import { InsertWishlist } from '@cococom/supabase/libs';
import { QueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Chip from '@/components/core/chip';
import Text from '@/components/core/text';
import ListItemWishlistIconButton from '@/components/custom/button/list-item-wishlist-icon';
import InfoIconText from '@/components/custom/text/info-icon';
import DiscountRecordView from '@/components/custom/view/discount-record';
import { DiscountChannels, ITEM_DETAILS_MAX_COUNT, PortalHostNames } from '@/constants';
import { getDiscountTypeFromResult } from '@/libs/item';
import { handleMutateOfSearchResult, queryKeys } from '@/libs/react-query';
import { InfiniteSearchResultData, SearchQueryParams, SearchResultToRender } from '@/libs/search';
import { SEARCH_ITEM_SORT_OPTIONS } from '@/libs/sort';
import Util from '@/libs/util';
import { useUserStore } from '@/store/user';

interface SearchResultListItemCardDetailViewProps extends SearchQueryParams {
  item: SearchResultToRender[number];
  sortOption: keyof typeof SEARCH_ITEM_SORT_OPTIONS;
  channelOption: DiscountChannels;
}

function SearchResultListItemCardDetailView({
  item,
  keyword,
  options,
  sortOption,
  channelOption,
}: SearchResultListItemCardDetailViewProps) {
  const { styles, theme } = useStyles(stylesheets);

  const user = useUserStore(store => store.user);

  const discountType = getDiscountTypeFromResult(item);

  const queryKey = useMemo(() => {
    const isOnSaleNow = options.includes('on_sale');
    const isItemIdSearch = options.includes('item_id');
    return queryKeys.search[isItemIdSearch ? 'itemId' : 'keyword'](
      keyword,
      isOnSaleNow,
      SEARCH_ITEM_SORT_OPTIONS[sortOption].field,
      SEARCH_ITEM_SORT_OPTIONS[sortOption].direction,
      channelOption,
      user?.id,
    );
  }, [channelOption, keyword, options, sortOption, user?.id]);

  const handleMutate = useCallback(
    (queryClient: QueryClient) => async (newWishlist: InsertWishlist) => {
      return await handleMutateOfSearchResult({
        queryClient,
        queryKey,
        newWishlist,
        pageIndexOfItem: item.pageIndex,
      });
    },
    [item.pageIndex, queryKey],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.itemNameText} numberOfLines={3}>
        {item.itemName}
      </Text>
      <DiscountRecordView
        item={item}
        discountType={discountType}
        style={styles.discountRecordContainer}
      />
      <View style={styles.footer}>
        {item.isOnSaleNow ? <Chip text="할인 중" /> : <View />}
        {/* <Text style={styles.textStyle}>리뷰: 1000개</Text> */}
        <View style={styles.actionButtonContainer}>
          <View style={styles.infoContainer}>
            <InfoIconText
              iconProps={{
                font: { type: 'FontAwesomeIcon', name: 'comments-o' },
                size: theme.fontSize.normal,
              }}
              textProps={{
                children: Util.showMaxNumber(item?.totalCommentCount, ITEM_DETAILS_MAX_COUNT),
              }}
            />
            {user ? (
              <InfoIconText
                iconProps={{
                  font: { type: 'FontAwesomeIcon', name: 'sticky-note-o' },
                  size: theme.fontSize.normal,
                }}
                textProps={{
                  children: Util.showMaxNumber(item?.totalMemoCount!, ITEM_DETAILS_MAX_COUNT),
                }}
              />
            ) : null}
          </View>
          <ListItemWishlistIconButton<InfiniteSearchResultData['pages'][number]['items'][number]>
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
    lineHeight: theme.fontSize.sm * 1.5,
    fontWeight: 'bold',
  },
  discountRecordContainer: {
    marginVertical: theme.spacing.sm,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.lg,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
}));

export default SearchResultListItemCardDetailView;
