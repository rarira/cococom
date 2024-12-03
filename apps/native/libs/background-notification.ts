import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import Util from './util';
import { storage } from './mmkv';
import { supabase } from './supabase';
import Sentry from './sentry';
import { NOTIFICATION_IDENTIFIER } from './notifications';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask<Notifications.FirebaseRemoteMessage | Record<string, unknown>>(
  BACKGROUND_NOTIFICATION_TASK,
  async ({ data, error, executionInfo }) => {
    if (Util.isPlatform('android') && !!data.notification) return;

    const userId = storage.getString('userId');

    if (!userId) return;

    try {
      const payload = Util.isPlatform('ios') ? data.body : JSON.parse(data.data?.body);
      const items = await supabase.wishlists.getWishlistItemsOnSaleStart({
        userId,
        historyId: payload.id,
      });

      Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDENTIFIER.LOCAL,
        content: {
          title: '할인 정보 업데이트',
          body: `${payload.isOnline ? '온라인' : '오프라인'} 할인 정보가 새로 업데이트 되었습니다. 추가된 할인: ${payload.newDiscount}, 새로운 상품: ${payload.newItems}, 관심상품 중 신규 할인 상품: ${items.length}개`,
        },
        trigger: { channelId: 'default', seconds: 0 },
      });
    } catch (e) {
      e.message = `Error in background notification task: ${e.message}`;
      Sentry.captureException(e);
    }
  },
);

console.log('Background notification task registered');
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
