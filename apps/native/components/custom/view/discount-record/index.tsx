import { Tables } from '@cococom/supabase/types';
import { memo } from 'react';
import { View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Divider from '@/components/core/divider';
import Text from '@/components/core/text';

import DiscountRateText from '../../text/discount-rate';
import SuperscriptWonText from '../../text/superscript-won';

interface DiscountRecordViewProps {
  isWholeProduct: boolean;
  item: Pick<Tables<'items'>, 'bestDiscount' | 'bestDiscountRate' | 'lowestPrice'>;
  style?: ViewProps['style'];
  infoDirection?: 'row' | 'column';
}

const DiscountRecordView = memo(function DiscountRecordView({
  isWholeProduct,
  item,
  style,
  infoDirection = 'column',
}: DiscountRecordViewProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={[styles.container, style]}>
      {isWholeProduct ? (
        <View style={styles.infoBlock(infoDirection)}>
          <Text style={styles.discountLabelText}>최대 단위당 할인 금액</Text>
          <SuperscriptWonText price={item.bestDiscount!} isMinus />
        </View>
      ) : (
        <>
          <View style={styles.infoBlock(infoDirection)}>
            <Text style={styles.discountLabelText}>최대 할인률</Text>
            <DiscountRateText discountRate={item.bestDiscountRate!} />
          </View>
          <Divider orientation="vertical" style={styles.infoDivider} />
          <View style={styles.infoBlock(infoDirection)}>
            <Text style={styles.discountLabelText}>최저가</Text>
            <SuperscriptWonText price={item.lowestPrice!} />
          </View>
        </>
      )}
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
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
  infoBlock: (infoDirection: 'row' | 'column') => ({
    flexDirection: infoDirection,
    alignItems: infoDirection === 'column' ? 'flex-end' : 'center',
    gap: infoDirection === 'row' ? theme.spacing.sm : 0,
  }),
  discountLabelText: {
    color: `${theme.colors.typography}AA`,
    fontSize: theme.fontSize.sm,
  },
}));

export default DiscountRecordView;
