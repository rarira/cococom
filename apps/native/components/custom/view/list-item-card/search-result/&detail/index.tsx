import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ListItemWishlistIconButton from '@/components/custom/button/list-item-wishlist-icon';
import { SearchResult } from '@/components/custom/list/search-result';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';

interface SearchResultListItemCardDetailViewProps {
  item: SearchResult[number];
}

function SearchResultListItemCardDetailView({ item }: SearchResultListItemCardDetailViewProps) {
  const { styles } = useStyles(stylesheets);

  const isWholeProduct = item.lowestPrice === 0;

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
          <ListItemWishlistIconButton item={item} portalHostName={PortalHostNames.SEARCH} />
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
