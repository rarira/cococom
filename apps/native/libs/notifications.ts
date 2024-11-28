import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import Util from './util';

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync(
  currentPermissionStatus?: Notifications.NotificationPermissionsStatus,
) {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    let existingStatus = currentPermissionStatus;
    let finalStatus = existingStatus;

    if (!existingStatus) {
      const permissionStatus = await Notifications.getPermissionsAsync();
      existingStatus = permissionStatus;
      finalStatus = permissionStatus;
    }

    if (existingStatus.status !== 'granted') {
      if (!finalStatus?.canAskAgain) return;
      const permissionStatus = await Notifications.requestPermissionsAsync();
      finalStatus = permissionStatus;
    }

    if (finalStatus?.status !== 'granted') {
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      if (Util.isPlatform('android')) {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          // TODO : 아이콘 정해지면 색상 변경
          lightColor: '#FF231F7C',
        });
      }
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return { token: pushTokenString, finalStatus };
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}
