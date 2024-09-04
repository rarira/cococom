import { JoinedItems } from '@cococom/supabase/types';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { Cell, Row, Table, TableWrapper } from 'react-native-reanimated-table';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountRateText from '@/components/custom/text/discount-rate';
import SuperscriptWonText from '@/components/custom/text/superscript-won';
import Text from '@/components/ui/text';
import { convertDateString } from '@/libs/date';

interface ItemDiscountHistoryTabViewProps {
  discounts: JoinedItems['discounts'];
}

const ItemDiscountHistoryTabView = memo(function ItemDiscountHistoryTabView({
  discounts,
}: ItemDiscountHistoryTabViewProps) {
  const { styles, theme } = useStyles(stylesheet);

  const renderPeriod = useCallback(
    (startDate: string, endDate: string) => {
      return (
        <View style={styles.periodColumn}>
          <Text style={styles.periodText}>{convertDateString(startDate) + ' ~'}</Text>
          <Text style={styles.periodText}>{convertDateString(endDate)}</Text>
        </View>
      );
    },
    [styles.periodColumn, styles.periodText],
  );

  const renderPrice = useCallback(
    (price: number, isMinus?: boolean, bold?: boolean) => {
      return (
        <View style={styles.priceColumn}>
          <SuperscriptWonText
            price={price}
            isMinus={isMinus}
            bold={bold}
            fontSize={theme.fontSize.sm}
          />
        </View>
      );
    },
    [styles.priceColumn, theme.fontSize.sm],
  );

  const renderDiscount = useCallback(
    (discount: number, discountRate: number | null) => {
      return (
        <View style={styles.priceColumn}>
          <View style={styles.discountPriceContainer}>
            <Text style={styles.cellText}>-</Text>
            <SuperscriptWonText price={discount} bold={false} fontSize={theme.fontSize.sm} />
          </View>

          {discountRate && (
            <DiscountRateText discountRate={discountRate} fontSize={theme.fontSize.sm} />
          )}
        </View>
      );
    },
    [styles.cellText, styles.discountPriceContainer, styles.priceColumn, theme.fontSize.sm],
  );

  if (!discounts) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>(최대 최근 10 건만 표시)</Text>
      <Table style={styles.table}>
        <Row
          data={['할인기간', '정가', '할인', '할인가']}
          style={styles.headerRow}
          textStyle={styles.headerText}
        />
        {discounts.map((discount, index) => (
          <TableWrapper key={discount.id} style={styles.row}>
            <Cell
              data={renderPeriod(discount.startDate, discount.endDate)}
              textStyle={styles.cellText}
            />
            <Cell data={renderPrice(discount.price, false, false)} textStyle={styles.cellText} />
            <Cell
              data={renderDiscount(discount.discount, discount.discountRate)}
              textStyle={styles.cellText}
            />
            <Cell data={renderPrice(discount.discountPrice)} textStyle={styles.cellText} />
          </TableWrapper>
        ))}
      </Table>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  title: {
    fontSize: theme.fontSize.sm,
    marginVertical: theme.spacing.md,
    textAlign: 'right',
  },
  table: { marginTop: theme.spacing.sm },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.typography,
  },

  headerText: {
    fontWeight: 'bold',
    color: theme.colors.typography,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.typography,
  },
  periodText: {
    color: theme.colors.typography,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm,
  },
  cellText: {
    color: theme.colors.typography,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm,
    textAlign: 'right',
  },
  discountPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  priceColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
}));

export default ItemDiscountHistoryTabView;
