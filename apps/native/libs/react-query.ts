import {
  CategorySectors,
  SearchItemSortDirection,
  SearchItemSortField,
} from '@cococom/supabase/libs';

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
  search: {
    keyword: (
      keyword: string,
      isOnSaleSearch: boolean,
      sortField: SearchItemSortField,
      sortDirecntion: SearchItemSortDirection,
      userId?: string,
    ) => ['search', { keyword, isOnSaleSearch, userId, sortField, sortDirecntion }],
    itemId: (
      itemId: string,
      isOnSaleSearch: boolean,
      sortField: SearchItemSortField,
      sortDirecntion: SearchItemSortDirection,
      userId?: string,
    ) => ['search', { itemId, isOnSaleSearch, userId, sortField, sortDirecntion }],
  },
  items: {
    byId: (id: number) => ['items', { id }],
  },
};
