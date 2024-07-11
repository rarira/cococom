import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ListItemCardProps } from '@/components/ui/card/list-item';
import Text from '@/components/ui/text';
import DiscountPeriodText from '@/components/ui/text/discount-period';
import DiscountRateText from '@/components/ui/text/discount-rate';
import SuperscriptWonText from '@/components/ui/text/superscript-won';
import ListItemCardChipsView from '@/components/ui/view/list-item-card/chips';
import Util from '@/libs/util';

interface ListItemCardDetailViewProps extends Pick<ListItemCardProps, 'discount'> {}

function ListItemCardDetailView({ discount }: ListItemCardDetailViewProps) {
  const { styles } = useStyles(stylesheets);
  return (
    <View style={styles.container}>
      <Text style={styles.itemNameText} numberOfLines={3}>
        {discount.items?.itemName}
      </Text>
      <View>
        <View style={styles.priceContainer}>
          <Text style={styles.regularPriceText}>{`\u20A9${Util.toWonString(discount.price)}`}</Text>
          <DiscountRateText discountRate={discount.discountRate!} />
          <SuperscriptWonText price={discount.discountPrice} />
        </View>
        <View style={styles.miscInfoContainer}>
          <ListItemCardChipsView discount={discount} />
          <DiscountPeriodText startDate={discount.startDate} endDate={discount.endDate} />
        </View>
        <View style={styles.actionButtonContainer}>
          <Text style={styles.textStyle}>리뷰: 1000개</Text>
          <Text style={styles.textStyle}>좋아요: 100개</Text>
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
    marginTop: theme.spacing.md,
  },
  regularPriceText: {
    fontSize: theme.fontSize.xs,
    lineHeight: theme.fontSize.xs,
    textDecorationLine: 'line-through',
    opacity: 0.6,
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
  textStyle: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm,
    opacity: 0.8,
  },
}));

export default ListItemCardDetailView;
