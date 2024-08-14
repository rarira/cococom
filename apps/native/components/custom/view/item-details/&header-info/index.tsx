import { JoinedItems } from '@cococom/supabase/types';
import { memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountPeriodText from '@/components/custom/text/discount-period';
import Text from '@/components/ui/text';
import { getDiscountInfoFromItem } from '@/libs/item';

import DiscountPriceView from '../../discount-price';
import DiscountRecordView from '../../discount-record';
import ListItemCardChipsView from '../../list-item-card/chips';

interface ItemDetailsHeaderInfoViewProps {
  item: JoinedItems;
}

const ItemDetailsHeaderInfoView = memo(function ItemDetailsHeaderInfoView({
  item,
}: ItemDetailsHeaderInfoViewProps) {
  const { styles } = useStyles(stylesheet);

  const { isOnSaleNow, discount, isWholeProduct } = getDiscountInfoFromItem(item);

  return (
    <View style={styles.container}>
      {isOnSaleNow && (
        <>
          <ListItemCardChipsView discount={discount} item={item} style={styles.chipViewContainer} />
          <View style={styles.saleInfoContainer}>
            <View style={styles.periodContainer}>
              <Text style={styles.onSaleText}>할인중</Text>
              <DiscountPeriodText startDate={discount.startDate} endDate={discount.endDate} />
            </View>
            {isWholeProduct ? (
              <DiscountPriceView
                isWholeProduct
                discount={discount.discount}
                style={styles.priceViewContainer}
              />
            ) : (
              <DiscountPriceView
                isWholeProduct={false}
                price={discount.price}
                discountPrice={discount.discountPrice}
                discountRate={discount.discountRate!}
                style={styles.priceViewContainer}
              />
            )}
          </View>
        </>
      )}
      <DiscountRecordView item={item} isWholeProduct={isWholeProduct} infoDirection="row" />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingVertical: theme.spacing.lg,
  },
  title: {
    lineHeight: theme.fontSize.md * 1.2,
  },
  chipViewContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    top: -theme.spacing.sm,
    right: theme.screenHorizontalPadding,
    left: 0,
  },
  saleInfoContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  periodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  onSaleText: {
    color: theme.colors.tint,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  priceViewContainer: {
    width: 'auto',
  },
}));

export default ItemDetailsHeaderInfoView;
