import { JoinedItems } from '@cococom/supabase/types';

import { isItemOnSaleNow } from './date';

export const getDiscountInfoFromItem = (item: JoinedItems) => {
  const isOnSaleNow = isItemOnSaleNow(item);

  if (!isOnSaleNow) {
    return { isOnSaleNow: false, discount: undefined, isWholeProduct: undefined };
  }

  if (!item.discounts?.length) {
    throw new Error('Item is on sale but no discount found');
  }

  const discount = item.discounts[item.discounts.length - 1];
  const isWholeProduct = discount.discountPrice === 0;

  return { isOnSaleNow, discount, isWholeProduct };
};
