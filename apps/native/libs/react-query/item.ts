import { JoinedItems } from '@cococom/supabase/types';
import { QueryClient, QueryKey } from '@tanstack/react-query';

export const itemQueryKeys = {
  byId: (id: number, userId?: string) => ['items', 'byId', { id, userId }],
};

export const handleMutateOfItems = async ({
  queryKey,
  queryClient,
}: {
  queryClient: QueryClient;
  queryKey: QueryKey;
}) => {
  await queryClient.cancelQueries({ queryKey });
  const previousData = queryClient.getQueryData(queryKey) as unknown as JoinedItems;

  queryClient.setQueryData(queryKey, (old: JoinedItems) => {
    return {
      ...old,
      isWishlistedByUser: !old.isWishlistedByUser,
      totalWishlistCount: old.isWishlistedByUser
        ? old.totalWishlistCount - 1
        : old.totalWishlistCount + 1,
    };
  });

  return { previousData };
};
