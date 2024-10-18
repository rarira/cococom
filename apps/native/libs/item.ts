import { AlltimeRankingResultItem, JoinedItems } from '@cococom/supabase/types';

import { DiscountType } from '@/components/custom/view/discount-record';
import { CurrentDiscounts } from '@/hooks/discount/useDiscountListQuery';

import { isItemOnSaleNow } from './date';
import { SearchResultToRender } from './search';

export const getDiscountInfoFromItem = (item: JoinedItems) => {
  const isOnSaleNow = isItemOnSaleNow(item);

  if (!item.discounts?.length) {
    throw new Error('Item is on sale but no discount found');
  }

  const discount = item.discounts[0];

  return { isOnSaleNow, discount, discountType: getDiscountTypeFromDiscount(discount as any) };
};

export const getDiscountTypeFromDiscount = (discount: Awaited<CurrentDiscounts>[number]) => {
  let discountType: DiscountType = 'normal';

  if (discount.discountPrice === 0 && !discount.is_online) {
    discountType = 'wholeProduct';
  } else if (discount.is_online && discount.price === 0 && discount.discountPrice === 0) {
    discountType = 'memberOnly';
  }

  return discountType;
};

export const getDiscountTypeFromResult = (
  item: AlltimeRankingResultItem | SearchResultToRender[number],
) => {
  let discountType: DiscountType = 'normal';

  if (item.lowestPrice === 0 && !item.is_online) {
    discountType = 'wholeProduct';
  } else if (item.is_online && item.lowestPrice === 0 && item.bestDiscountRate === 0) {
    discountType = 'memberOnly';
  }

  return discountType;
};
