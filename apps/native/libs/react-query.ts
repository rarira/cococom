import { CategorySectors } from '@cococom/supabase/libs';

export const queryKeys = {
  discounts: {
    currentList: (userId?: string | null, categorySector?: CategorySectors | null) => [
      'discounts',
      { userId, currentTimestamp: new Date().toISOString().split('T')[0], categorySector },
    ],
    currentListByCategorySector: () => [
      'discounts',
      { currentTimestamp: new Date().toISOString().split('T')[0] },
    ],
  },
  histories: {
    latest: ['histories', 'latest'],
  },
};
