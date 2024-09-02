import { CategorySectors } from '@cococom/supabase/libs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useLayoutEffect } from 'react';

import { DiscountListItemCardProps } from '@/components/custom/card/list-item/discount';
import { queryKeys } from '@/libs/react-query';
import { DiscountSortOption, updateDiscountsByCategorySectorCache } from '@/libs/sort';
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

export function useDiscountListQuery(sortOption: DiscountSortOption, limit?: number) {
  const user = useUserStore(store => store.user);

  const { categorySector } = useLocalSearchParams<{ categorySector: CategorySectors }>();

  const queryClient = useQueryClient();

  const queryKey = queryKeys.discounts.currentList(user?.id, categorySector);

  const { data, error, isLoading, isFetched } = useQuery({
    queryKey,
    queryFn: () => {
      const isCached = queryClient.getQueryData(queryKey);

      if (!isCached) {
        return fetchCurrentDiscounts({ userId: user?.id, categorySector: categorySector });
      }

      return isCached as DiscountListItemCardProps['discount'][];
    },
  });

  useLayoutEffect(() => {
    if (isFetched) {
      updateDiscountsByCategorySectorCache({
        userId: user?.id,
        sortOption,
        categorySector,
        queryClient,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySector, isFetched, queryClient, sortOption.text, user?.id]);

  return { data: data?.slice(0, limit), error, isLoading, queryKey };
}
