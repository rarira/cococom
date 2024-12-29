import type { AppStateStatus } from 'react-native';

import '@/libs/background-notification';
import '@/styles/unistyles';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { setDefaultOptions } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from 'react-native-error-boundary';
import { QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useDevPlugins } from '@/hooks/useDevPlugins';
import { useLoadUser } from '@/hooks/useLoadUser';
import { useDiscountChannelsArrange } from '@/hooks/settings/useDiscountChannelArrange';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import Sentry from '@/libs/sentry';
import { useExpoUpdate } from '@/hooks/useExpoUpdate';
import CircularProgress from '@/components/core/progress/circular';
import { usePushNotifications } from '@/hooks/notification/usePushNotifications';
import StatusBar from '@/components/custom/status-bar';
import { useSplashScreen } from '@/hooks/useSplashScreen';
import { queryClient, handleAppStateChange } from '@/libs/react-query/client';
import { useAppState } from '@/hooks/useAppState';

export { ErrorBoundary } from 'expo-router';

LogBox.ignoreLogs(['Failed prop type']);

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: true, // Reanimated runs in strict mode by default
});

setDefaultOptions({ locale: ko });

initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_TEST_NATIVE_APP_KEY ?? '');

function RootLayout() {
  useDevPlugins({ queryClient });

  const { isUpdating, checkUpdate } = useExpoUpdate();

  useLoadUser();

  usePushNotifications();

  useDiscountChannelsArrange();

  const { reportToSentry } = useErrorHandler();

  const { theme } = useColorScheme(true);

  const { appIsReady } = useSplashScreen();

  useAppState(
    useCallback(
      (status: AppStateStatus) => {
        handleAppStateChange(status);
        if (status === 'active') {
          checkUpdate();
        }
      },
      [checkUpdate],
    ),
  );

  if (!appIsReady || isUpdating) {
    return <CircularProgress style={{ flex: 1 }} />;
  }

  return (
    <>
      <StatusBar />
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
                        headerShown: false,
                      }}
                    >
                      <Stack.Screen name="index" />
                      <Stack.Screen name="(main)" />
                      <Stack.Screen name="+not-found" />
                      <Stack.Screen
                        name="auth"
                        options={{
                          presentation: 'modal',
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
