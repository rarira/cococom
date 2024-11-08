import { SupabaseClient } from '@supabase/supabase-js';

import {
  Database,
  InsertComment,
  JoinedComments,
  JoinedMyComments,
  SortOptionDirection,
} from '../merged-types';

export class CommentsTable {
  private supabaseClient: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient;
  }

  async fetchComments({
    itemId,
    page,
    pageSize,
  }: {
    itemId: number;
    page: number;
    pageSize: number;
  }) {
    const { data, error } = await this.supabaseClient
      .from('comments')
      .select('id, created_at, content, item_id, author:profiles (id, nickname)')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error(error);
      throw error;
    }

    return data as unknown as JoinedComments[];
  }

  async fetchMyComments({
    userId,
    page,
    pageSize = 20,
    orderBy = 'created_at',
    orderDirection = 'DESC',
  }: {
    userId: string;
    page: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: SortOptionDirection;
  }) {
    let promise = this.supabaseClient
      .from('comments')
      .select('id, created_at, content, item:items (id, itemName, itemId, totalCommentCount)')
      .eq('user_id', userId);

    if (orderBy?.startsWith('item.')) {
      promise = promise.order(`item(${orderBy.split('.')[1]})`, {
        ascending: orderDirection !== 'DESC',
      });
    } else {
      promise = promise.order(orderBy, { ascending: orderDirection !== 'DESC' });
    }

    const { data, error } = await promise.range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error(error);
      throw error;
    }

    return data as unknown as JoinedMyComments[];
  }

  async insertComment(comment: InsertComment) {
    const { data, error } = await this.supabaseClient
      .from('comments')
      .insert(comment)
      .select('id,created_at,item:items (id, itemId, itemName, is_online)');

    if (error) {
      console.error(error);
      throw error;
    }

    return data;
  }

  async deleteComment(commentId: number) {
    const { error } = await this.supabaseClient.from('comments').delete().eq('id', commentId);

    if (error) {
      console.error(error);
      throw error;
    }
  }
}
