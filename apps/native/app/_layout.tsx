import type { AppStateStatus } from 'react-native';

import '@/libs/background-notification';
import '@/styles/unistyles';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import NetInfo from '@react-native-community/netinfo';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {
  focusManager,
  onlineManager,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { setDefaultOptions } from 'date-fns';
import { ko, tr } from 'date-fns/locale';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';
import { AppState, LogBox, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from 'react-native-error-boundary';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { PushNotificationTrigger } from 'expo-notifications';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useDevPlugins } from '@/hooks/useDevPlugins';
import { useLoadUser } from '@/hooks/useLoadUser';
import { useDiscountChannelsArrange } from '@/hooks/settings/useDiscountChannelArrange';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import Sentry, { reactNavigationIntegration } from '@/libs/sentry';
import { useExpoUpdate } from '@/hooks/useExpoUpdate';
import CircularProgress from '@/components/core/progress/circular';
import { usePushNotifications } from '@/hooks/notification/usePushNotifications';
import Util from '@/libs/util';
export { ErrorBoundary } from 'expo-router';

LogBox.ignoreLogs(['Failed prop type']);

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: true, // Reanimated runs in strict mode by default
});

setDefaultOptions({ locale: ko });

initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_TEST_NATIVE_APP_KEY ?? '');

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      Sentry.captureException(error);
    },
  }),
});

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
});

Notifications.setNotificationHandler({
  handleNotification: async notification => {
    //https://github.com/expo/expo/issues/31184
    const trigger = notification.request.trigger as PushNotificationTrigger;
    if (trigger?.type === 'push') {
      const isDataOnly =
        trigger?.remoteMessage?.notification === null ||
        trigger?.payload?.aps['content-available'] === 1;

      console.log('isDataOnly push not show any alert', isDataOnly);
      if (isDataOnly) {
        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      }
    }
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

function RootLayout() {
  const navigationRef = useNavigationContainerRef();

  useDevPlugins({ queryClient, navigationRef });

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter: require('../assets/fonts/Inter_18pt-Medium.ttf'),
  });

  const { isUpdating } = useExpoUpdate();

  useLoadUser();

  usePushNotifications();

  useDiscountChannelsArrange();

  const { reportToSentry } = useErrorHandler();

  const { theme } = useColorScheme();

  useEffect(() => {
    if (navigationRef) {
      reactNavigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [navigationRef]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  if (!loaded || isUpdating) {
    return <CircularProgress style={{ flex: 1 }} />;
  }

  return (
    <>
      <StatusBar style={Util.isPlatform('ios') ? 'light' : 'auto'} />
      <ErrorBoundary onError={reportToSentry}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <SafeAreaProvider>
              <PortalProvider>
                <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
                  <BottomSheetModalProvider>
                    <Stack
                      screenOptions={{
                        contentStyle: {
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      <Stack.Screen
                        name="(main)"
                        options={{
                          headerShown: false,
                        }}
                      />
                      <Stack.Screen name="+not-found" />
                      <Stack.Screen
                        name="auth"
                        options={{
                          presentation: 'modal',
                          headerShown: false,
                          gestureEnabled: false,
                        }}
                      />
                    </Stack>
                  </BottomSheetModalProvider>
                </ThemeProvider>
              </PortalProvider>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}

export default Sentry.wrap(RootLayout);
