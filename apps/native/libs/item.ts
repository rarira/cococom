import { JoinedItems } from '@cococom/supabase/types';

import { DiscountType } from '@/components/custom/view/discount-record';
import { CurrentDiscounts } from '@/hooks/discount/useDiscountListQuery';

import { isItemOnSaleNow } from './date';

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
