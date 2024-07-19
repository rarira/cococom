import { CategorySectors } from '@cococom/supabase/libs';

export const queryKeys = {
  discounts: {
    currentList: (userId?: string | null, categorySector?: CategorySectors | null) => [
      'discounts',
      { userId, categorySector, currentTimestamp: new Date().toISOString().split('T')[0] },
    ],
    currentListByCategorySector: () => [
      'discounts',
      { currentTimestamp: new Date().toISOString().split('T')[0] },
    ],
  },
};
