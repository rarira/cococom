import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import Util from './util';
import { storage } from './mmkv';
import { supabase } from './supabase';
import Sentry from './sentry';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask<Notifications.FirebaseRemoteMessage | Record<string, unknown>>(
  BACKGROUND_NOTIFICATION_TASK,
  async ({ data, error, executionInfo }) => {
    if (Util.isPlatform('android') && !!data.notification) return;

    const userId = storage.getString('userId');

    if (!userId) return;

    try {
      const items = await supabase.wishlists.getWishlistItemsOnSaleStart({
        userId,
        // test용
        historyId: data.body?.id ?? JSON.parse(data.data?.body).id,
      });

      console.log({ data, item: items[0], lenght: items.length });
    } catch (e) {
      e.message = `Error in background notification task: ${e.message}`;
      Sentry.captureException(e);
    }
  },
);

console.log('Background notification task registered');
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
