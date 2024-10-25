import { JoinedItems, Tables } from '@cococom/supabase/types';
import { add, isAfter } from 'date-fns';
import { useMemo } from 'react';
import { View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types';

import Chip from '@/components/core/chip';
import { DiscountListItemCardProps } from '@/components/custom/card/list-item/discount';
import { 할인마감임박잔여일수 } from '@/constants';
import { getDiscountTypeFromDiscount } from '@/libs/item';

type ChipsDiscount = Pick<
  Tables<'discounts'>,
  'discount' | 'discountPrice' | 'discountRate' | 'endDate' | 'is_online'
>;

type ChipsItem = Pick<
  JoinedItems,
  'totalDiscountCount' | 'lowestPrice' | 'bestDiscount' | 'bestDiscountRate' | 'is_online'
>;
type ListItemCardChipsViewProps = (
  | {
      discount: ChipsDiscount;
      item: ChipsItem;
    }
  | {
      discount: DiscountListItemCardProps['discount'];
      item?: never;
    }
) & { style?: ViewProps['style'] };

const chips = [
  {
    text: '첫할인',
    checkFn: (discount: ChipsDiscount, item: ChipsItem) =>
      !item.is_online && !discount.is_online && item.totalDiscountCount === 1,
    color: (theme: UnistylesTheme) => theme.colors.tint3,
  },
  {
    text: '최저가',
    checkFn: (discount: ChipsDiscount, item: ChipsItem) =>
      discount.discountPrice !== 0 &&
      item.totalDiscountCount > 1 &&
      discount.discountPrice === item?.lowestPrice,
    color: (theme: UnistylesTheme) => theme.colors.tint,
  },
  {
    text: '최대할인',
    checkFn: (discount: ChipsDiscount, item: ChipsItem) =>
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
  {
    text: '회원전용할인',
    checkFn: (discount: ChipsDiscount) =>
      getDiscountTypeFromDiscount(discount as any) === 'memberOnly',
    color: (theme: UnistylesTheme) => theme.colors.background,
  },
];

function ListItemCardChipsView({ discount, item, style }: ListItemCardChipsViewProps) {
  const { styles, theme } = useStyles(stylesheet);

  const chipsToRender = useMemo(
    () =>
      chips
        .filter(chip => chip.checkFn(discount, item ?? discount.items))
        .map(chip => (
          <Chip
            key={chip.text}
            text={chip.text}
            style={{
              backgroundColor: chip.color(theme),
              borderColor: chip.text === '회원전용할인' ? theme.colors.typography : undefined,
              borderWidth: chip.text === '회원전용할인' ? 1 : 0,
            }}
            textProps={{
              style:
                chip.text === '곧마감' || chip.text === '첫할인'
                  ? styles.alertText
                  : chip.text === '회원전용할인'
                    ? styles.memberOnlyText
                    : undefined,
            }}
          />
        )),
    [discount, item, styles.alertText, styles.memberOnlyText, theme],
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
  memberOnlyText: {
    color: theme.colors.typography,
  },
}));

export default ListItemCardChipsView;
