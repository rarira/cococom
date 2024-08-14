import { JoinedItems } from '@cococom/supabase/types';

import { isItemOnSaleNow } from './date';

export const getDiscountInfoFromItem = (item: JoinedItems) => {
  const isOnSaleNow = isItemOnSaleNow(item);

  if (!item.discounts?.length) {
    throw new Error('Item is on sale but no discount found');
  }

  const discount = item.discounts[0];
  const isWholeProduct = discount.discountPrice === 0;

  return { isOnSaleNow, discount, isWholeProduct };
};
