import { onlineManager, focusManager, QueryCache, QueryClient } from '@tanstack/react-query';
import { AppStateStatus, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import Sentry from '../sentry';

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      Sentry.captureException(error);
    },
  }),
});

export function handleAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}
