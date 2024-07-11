import { add, isAfter } from 'date-fns';
import { useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types';

import { ListItemCardProps } from '@/components/ui/card/list-item';
import Chip from '@/components/ui/chip';
import { 할인마감임박잔여일수 } from '@/constants/numbers';

interface ListItemCardChipsViewProps extends Pick<ListItemCardProps, 'discount'> {}

const chips = [
  {
    text: '최저가',
    checkFn: (discount: ListItemCardProps['discount']) =>
      discount.discountPrice === discount.items?.lowestPrice,
    color: (theme: UnistylesTheme) => theme.colors.tint,
  },
  {
    text: '최대할인',
    checkFn: (discount: ListItemCardProps['discount']) =>
      discount.discountRate === discount.items?.bestDiscountRate,
    color: (theme: UnistylesTheme) => theme.colors.tint2,
  },
  {
    text: '첫할인',
    checkFn: (discount: ListItemCardProps['discount']) => discount.items?.discounts.length === 1,
    color: (theme: UnistylesTheme) => theme.colors.tint3,
  },
  {
    text: '곧마감',
    checkFn: (discount: ListItemCardProps['discount']) =>
      isAfter(add(new Date(), { days: 할인마감임박잔여일수 }), new Date(discount.endDate)),
    color: (theme: UnistylesTheme) => theme.colors.alert,
  },
];

function ListItemCardChipsView({ discount }: ListItemCardChipsViewProps) {
  const { styles, theme } = useStyles(stylesheet);

  const chipsToRender = useMemo(
    () =>
      chips
        .filter(chip => chip.checkFn(discount))
        .map(chip => (
          <Chip key={chip.text} text={chip.text} style={{ backgroundColor: chip.color(theme) }} />
        )),
    [discount, theme],
  );

  return <View style={styles.container}>{chipsToRender}</View>;
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
}));

export default ListItemCardChipsView;
