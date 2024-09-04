import { CategorySectors, InsertWishlist } from '@cococom/supabase/libs';
import { JoinedItems } from '@cococom/supabase/types';
import { QueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ListItemWishlistIconButton from '@/components/custom/button/list-item-wishlist-icon';
import { DiscountListItemCardProps } from '@/components/custom/card/list-item/discount';
import DiscountPeriodText from '@/components/custom/text/discount-period';
import InfoIconText from '@/components/custom/text/info-icon';
import ListItemCardChipsView from '@/components/custom/view/list-item-card/chips';
import Text from '@/components/ui/text';
import { ITEM_DETAILS_MAX_COUNT } from '@/constants';
import { handleMutateOfDiscountCurrentList, queryKeys } from '@/libs/react-query';
import Util from '@/libs/util';
import { useUserStore } from '@/store/user';

import DiscountPriceView from '../../../discount-price';

interface DiscountListItemCardDetailViewProps
  extends Pick<DiscountListItemCardProps, 'discount' | 'portalHostName'> {}

function DiscountListItemCardDetailView({
  discount,
  portalHostName,
}: DiscountListItemCardDetailViewProps) {
  const { styles, theme } = useStyles(stylesheets);
  const user = useUserStore(store => store.user);
  const isWholeProduct = discount.discountPrice === 0;

  const { categorySector: categorySectorParam } = useLocalSearchParams<{
    categorySector: CategorySectors;
  }>();

  const queryKey = useMemo(
    () => queryKeys.discounts.currentList(user?.id, categorySectorParam),
    [user?.id, categorySectorParam],
  );

  const handleMutate = useCallback(
    (queryClient: QueryClient) => async (newWishlist: InsertWishlist) => {
      return await handleMutateOfDiscountCurrentList({
        queryClient,
        queryKey,
        newWishlist,
      });
    },
    [queryKey],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.itemNameText} numberOfLines={3}>
        {discount.items?.itemName}
      </Text>
      <View>
        <View style={styles.priceContainer}>
          {isWholeProduct ? (
            <DiscountPriceView discount={discount.discount} isWholeProduct={isWholeProduct} />
          ) : (
            <DiscountPriceView
              price={discount.price}
              discountRate={discount.discountRate}
              discountPrice={discount.discountPrice}
              isWholeProduct={isWholeProduct}
            />
          )}
        </View>
        <View style={styles.miscInfoContainer}>
          <ListItemCardChipsView discount={discount} />
          <DiscountPeriodText startDate={discount.startDate} endDate={discount.endDate} />
        </View>
        <View style={styles.actionButtonContainer}>
          <View style={styles.infoContainer}>
            <InfoIconText
              iconProps={{
                font: { type: 'FontAwesomeIcon', name: 'comments-o' },
                size: theme.fontSize.normal,
              }}
              textProps={{
                children: Util.showMaxNumber(
                  discount.items?.totalCommentCount,
                  ITEM_DETAILS_MAX_COUNT,
                ),
              }}
            />
            {user ? (
              <InfoIconText
                iconProps={{
                  font: { type: 'FontAwesomeIcon', name: 'sticky-note-o' },
                  size: theme.fontSize.normal,
                }}
                textProps={{
                  children: Util.showMaxNumber(
                    discount.items?.totalMemoCount!,
                    ITEM_DETAILS_MAX_COUNT,
                  ),
                }}
              />
            ) : null}
          </View>
          {/* <Text style={styles.textStyle}>리뷰: 1000개</Text> */}
          <ListItemWishlistIconButton<JoinedItems>
            item={discount.items}
            portalHostName={portalHostName}
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
    gap: theme.spacing.lg,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
}));

export default DiscountListItemCardDetailView;
