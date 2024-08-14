import { InsertWishlist } from '@cococom/supabase/libs';
import { QueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ListItemWishlistIconButton from '@/components/custom/button/list-item-wishlist-icon';
import Chip from '@/components/ui/chip';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';
import { handleMutateOfSearchResult, queryKeys } from '@/libs/react-query';
import { InfiniteSearchResultData, SearchQueryParams, SearchResultToRender } from '@/libs/search';
import { ITEM_SORT_OPTIONS } from '@/libs/sort';
import { useListQueryKeyStore } from '@/store/list-query-key';
import { useUserStore } from '@/store/user';

import DiscountRecordView from '../../../discount-record';

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

  const [setQueryKeyOfList, setPageIndexOfInfinteList] = useListQueryKeyStore(state => [
    state.setQueryKeyOfList,
    state.setPageIndexOfInfinteList,
  ]);
  const user = useUserStore(store => store.user);

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
        isWholeProduct={isWholeProduct}
        style={styles.discountRecordContainer}
      />
      <View style={styles.actionButtonContainer}>
        {item.isOnSaleNow ? <Chip text="할인 중" /> : <View />}
        {/* <Text style={styles.textStyle}>리뷰: 1000개</Text> */}
        <ListItemWishlistIconButton<InfiniteSearchResultData['pages'][number]['items'][number]>
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
  discountRecordContainer: {
    marginVertical: theme.spacing.sm,
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
