import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { findAllQueryKeysByUserId } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

import { useSignOut } from './useSignOut';

export function useDeleteUser() {
  const { user, setAuthProcessing } = useUserStore(state => ({
    user: state.user,
    setAuthProcessing: state.setAuthProcessing,
  }));

  const queryClient = useQueryClient();

  const signOut = useSignOut();

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await supabase.deleteUser(userId);
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
