import { InsertComment } from '@cococom/supabase/libs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
    handleMutateOfDeleteComment,
    handleMutateOfInsertComment,
    queryKeys,
} from '@/libs/react-query';
import { supabase, supabaseClient } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export function useRealtimeComments(itemId: number) {
  const user = useUserStore(store => store.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    const commentsQueryKey = queryKeys.comments.byItem(itemId);
    const itemQueryKey = queryKeys.items.byId(itemId, user?.id);

    const channel = supabaseClient
      .channel(`${itemId}-comments-db-change`)
      .on(
        'postgres_changes',
        {
          schema: 'public',
          table: 'comments',
          event: '*',
        },
        async payload => {
          if (payload.eventType === 'DELETE') {
            handleMutateOfDeleteComment({
              queryClient,
              queryKey: commentsQueryKey,
              commentId: payload.old.id,
              itemQueryKey,
            });

            return;
          }
          if (payload.eventType === 'INSERT') {
            const author = await supabase.fetchData(
              { value: payload.new.user_id, column: 'id' },
              'profiles',
              'id, nickname',
            );

            const newComment = {
              ...payload.new,
              user_id: undefined,
              author,
            } as unknown as InsertComment;

            handleMutateOfInsertComment({
              queryClient,
              queryKey: commentsQueryKey,
              newComment,
              itemQueryKey,
              needSort: true,
            });
            return;
          }
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [itemId, queryClient, user?.id]);
}