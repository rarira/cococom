import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useSignOut } from '@/hooks/auth/useSignOut';
import { findAllQueryKeysByUserId } from '@/libs/react-query/util';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useDeleteUser() {
  const { user, setAuthProcessing } = useUserStore(state => ({
    user: state.user,
    setAuthProcessing: state.setAuthProcessing,
  }));

  const queryClient = useQueryClient();

  const signOut = useSignOut();

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await supabase.auth.deleteUser(userId);
    },
    onSuccess: async (_data, variables) => {
      findAllQueryKeysByUserId(queryClient, variables).forEach(key => {
        queryClient.removeQueries({ queryKey: key, exact: true });
      });
      await signOut();
    },
  });

  const deleteUser = useCallback(async () => {
    if (!user) return;
    setAuthProcessing(true);
    await deleteUserMutation.mutateAsync(user?.id);
    setAuthProcessing(false);
  }, [deleteUserMutation, setAuthProcessing, user]);

  return deleteUser;
}
