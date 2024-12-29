import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

import Util from './util';
import { updateTodaysNotificationStorage } from './mmkv';
import { supabase, supabaseClient } from './supabase';
import Sentry from './sentry';
import { getLocalHistoryNotificationBody, NOTIFICATION_IDENTIFIER } from './notifications';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask<Notifications.FirebaseRemoteMessage | Record<string, unknown>>(
  BACKGROUND_NOTIFICATION_TASK,
  async ({ data }) => {
    if (Util.isPlatform('android') && !!data.notification) return;

    try {
      const { data: sessionData, error } = await supabaseClient.auth.getSession();

      if (error) {
        throw error;
      }

      const userId = sessionData.session?.user.id;

      if (!userId) return;

      const payload = Util.isPlatform('ios') ? data.body : JSON.parse(data.data?.body);

      const items = await supabase.wishlists.getWishlistItemsOnSaleStart({
        userId,
        historyId: payload.id,
      });

      Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDENTIFIER.LOCAL,
        content: {
          title: '코코컴 할인 정보 업데이트',
          body: getLocalHistoryNotificationBody(payload, items),
          data: { url: 'cccom:///home' },
        },
        trigger: Util.isPlatform('ios') ? null : { channelId: 'default', seconds: 0 },
      });

      updateTodaysNotificationStorage(items);
    } catch (e) {
      e.message = `Error in background notification task: ${e.message}`;
      Sentry.captureException(e);
    }
  },
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
