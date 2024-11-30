import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

import Util from './util';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
  if (Util.isPlatform('android') && !!(data as any).notification) return;
  console.log('Received a notification in the background!', Util.isPlatform('android'), data);

  // 안드로이드 killed 상태에선 다음 앱 실행시에 작동함
  // Do something with the notification data
});

console.log('Background notification task registered');
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
