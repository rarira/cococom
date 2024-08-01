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
import DiscountRateText from '@/components/custom/text/discount-rate';
import SuperscriptWonText from '@/components/custom/text/superscript-won';
import ListItemCardChipsView from '@/components/custom/view/list-item-card/chips';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import Util from '@/libs/util';
import { useUserStore } from '@/store/user';

interface DiscountListItemCardDetailViewProps extends Pick<DiscountListItemCardProps, 'discount'> {}

function DiscountListItemCardDetailView({ discount }: DiscountListItemCardDetailViewProps) {
  const { styles } = useStyles(stylesheets);
  const { user } = useUserStore();

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
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey) as unknown as JoinedItems[];

      const discountIndex = previousData?.findIndex((d: any) => d.items.id === newWishlist.itemId);

      const item = discount.items;

      queryClient.setQueryData(queryKey, (old: any) => {
        if (discountIndex === -1) return old;
        const updatedDiscount = {
          ...old[discountIndex],
          items: {
            ...old[discountIndex].items,
            totalWishlistCount: item.isWishlistedByUser
              ? item.totalWishlistCount - 1
              : item.totalWishlistCount + 1,
            isWishlistedByUser: !item.isWishlistedByUser,
          },
        };

        return [...old.slice(0, discountIndex), updatedDiscount, ...old.slice(discountIndex + 1)];
      });

      return { previousData };
    },
    [discount.items, queryKey],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.itemNameText} numberOfLines={3}>
        {discount.items?.itemName}
      </Text>
      <View>
        <View style={styles.priceContainer}>
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
        </View>
        <View style={styles.actionButtonContainer}>
          {/* <Text style={styles.textStyle}>리뷰: 1000개</Text> */}
          <ListItemWishlistIconButton<JoinedItems>
            item={discount.items}
            portalHostName={PortalHostNames.HOME}
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

export default DiscountListItemCardDetailView;
