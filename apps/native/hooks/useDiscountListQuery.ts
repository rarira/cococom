import { CategorySectors } from '@cococom/supabase/libs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useLayoutEffect } from 'react';

import { ListItemCardProps } from '@/components/custom/card/list-item';
import { queryKeys } from '@/libs/react-query';
import { DISCOUNT_SORT_OPTIONS, updateDiscountsByCategorySectorCache } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

function fetchCurrentDiscounts({
  userId,
  categorySector,
}: {
  userId?: string;
  categorySector?: CategorySectors;
}) {
  const currentTimestamp = new Date().toISOString().split('T')[0];

  return supabase.fetchCurrentDiscountsWithWishlistCount({
    currentTimestamp,
    userId,
    categorySector,
  });
}

export type CurrentDiscounts = NonNullable<ReturnType<typeof fetchCurrentDiscounts>>;

export function useDiscountListQuery(currentSort: keyof typeof DISCOUNT_SORT_OPTIONS) {
  const { user } = useUserStore();

  const { categorySector } = useLocalSearchParams<{ categorySector: CategorySectors }>();

  const queryClient = useQueryClient();

  const queryKey = queryKeys.discounts.currentList(user?.id, categorySector);

  const { data, error, isLoading, isFetched } = useQuery({
    queryKey,
    queryFn: () => {
      const isCached = queryClient.getQueryData(queryKey);

      if (!isCached) {
        return fetchCurrentDiscounts({ userId: user?.id, categorySector });
      }

      return isCached as ListItemCardProps['discount'][];
    },
  });

  useLayoutEffect(() => {
    if (isFetched) {
      updateDiscountsByCategorySectorCache({
        userId: user?.id,
        sortKey: currentSort,
        categorySector,
        queryClient,
      });
    }
  }, [categorySector, currentSort, isFetched, queryClient, user?.id]);

  return { data, error, isLoading };
}
