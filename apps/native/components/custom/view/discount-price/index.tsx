import { memo } from 'react';
import { View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import Util from '@/libs/util';

import DiscountRateText from '../../text/discount-rate';
import SuperscriptWonText from '../../text/superscript-won';
import { DiscountType } from '../discount-record';

type DiscountPriceViewProps = (
  | {
      discountType: Exclude<DiscountType, 'normal'>;
      price?: never;
      discountRate?: never;
      discountPrice?: never;
      discount: number;
    }
  | {
      discountType: Exclude<DiscountType, 'memberOnly' | 'wholeProduct'>;
      price: number;
      discountRate: number;
      discountPrice: number;
      discount?: never;
    }
) & { style?: ViewProps['style'] };

const DiscountPriceView = memo(function DiscountPriceView({
  discountType,
  price,
  discount,
  discountPrice,
  discountRate,
  style,
}: DiscountPriceViewProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={[styles.container, style]}>
      {discountType !== 'normal' ? null : (
        <>
          <Text style={styles.regularPriceText}>{`\u20A9${Util.toWonString(price)}`}</Text>
          <DiscountRateText discountRate={discountRate} />
        </>
      )}
      <SuperscriptWonText
        price={discountType === 'normal' ? discountPrice : discount}
        isMinus={discountType !== 'normal'}
      />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  regularPriceText: {
    fontSize: theme.fontSize.xs,
    lineHeight: theme.fontSize.xs,
    textDecorationLine: 'line-through',
    opacity: 0.8,
    marginEnd: theme.spacing.sm,
  },
}));

export default DiscountPriceView;
