import { JoinedItems, Tables } from '@cococom/supabase/types';
import { add, isAfter } from 'date-fns';
import { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types';

import { DiscountListItemCardProps } from '@/components/custom/card/list-item/discount';
import Chip from '@/components/ui/chip';
import { 할인마감임박잔여일수 } from '@/constants/numbers';

type ChipsDiscount = Omit<Tables<'discounts'>, 'created_at' | 'discountHash' | 'itemId'>;
type ListItemCardChipsViewProps = (
  | {
      discount: ChipsDiscount;
      item: JoinedItems;
    }
  | {
      discount: DiscountListItemCardProps['discount'];
      item?: never;
    }
) & { style?: ViewProps['style'] };

const chips = [
  {
    text: '첫할인',
    checkFn: (discount: ChipsDiscount, item: JoinedItems) => item.totalDiscountCount === 1,
    color: (theme: UnistylesTheme) => theme.colors.tint3,
  },
  {
    text: '최저가',
    checkFn: (discount: ChipsDiscount, item: JoinedItems) =>
      discount.discountPrice !== 0 &&
      item.totalDiscountCount > 1 &&
      discount.discountPrice === item?.lowestPrice,
    color: (theme: UnistylesTheme) => theme.colors.tint,
  },
  {
    text: '최대할인',
    checkFn: (discount: ChipsDiscount, item: JoinedItems) =>
      item.totalDiscountCount > 1 &&
      (discount.discountPrice === 0
        ? discount.discount === item?.bestDiscount
        : discount.discountRate === item?.bestDiscountRate),
    color: (theme: UnistylesTheme) => theme.colors.tint2,
  },
  {
    text: '곧마감',
    checkFn: (discount: ChipsDiscount) =>
      isAfter(add(new Date(), { days: 할인마감임박잔여일수 }), new Date(discount.endDate)),
    color: (theme: UnistylesTheme) => theme.colors.alert,
  },
];

function ListItemCardChipsView({ discount, item, style }: ListItemCardChipsViewProps) {
  const { styles, theme } = useStyles(stylesheet);

  const chipsToRender = useMemo(
    () =>
      chips
        .filter(chip => chip.checkFn(discount, item || discount.items))
        .map(chip => (
          <Chip
            key={chip.text}
            text={chip.text}
            style={{ backgroundColor: chip.color(theme) }}
            textProps={{
              style:
                chip.text === '곧마감' || chip.text === '첫할인' ? styles.alertText : undefined,
            }}
          />
        )),
    [discount, item, styles.alertText, theme],
  );

  return <View style={[styles.container, style]}>{chipsToRender}</View>;
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  alertText: {
    color: 'white',
  },
}));

export default ListItemCardChipsView;
