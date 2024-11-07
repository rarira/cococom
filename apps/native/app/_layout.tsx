import type { AppStateStatus } from 'react-native';

import '@/styles/unistyles';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import NetInfo from '@react-native-community/netinfo';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { setDefaultOptions } from 'date-fns';
import { ko } from 'date-fns/locale';
import { isRunningInExpoGo } from 'expo';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';
import { AppState, LogBox, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useDevPlugins } from '@/hooks/useDevPlugins';
import { useLoadUser } from '@/hooks/useLoadUser';

LogBox.ignoreLogs(['Failed prop type']);

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: true, // Reanimated runs in strict mode by default
});

setDefaultOptions({ locale: ko });

export { ErrorBoundary } from 'expo-router';

initializeKakaoSDK(Constants.expoConfig?.extra?.kakao?.nativeAppKey);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const reactNavigationIntegration = Sentry.reactNavigationIntegration();

const queryClient = new QueryClient();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableNativeFramesTracking: !isRunningInExpoGo(),
  integrations: [reactNavigationIntegration],
});

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(!!state.isConnected);
  });
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

  useLoadUser();
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

  if (!loaded) {
    return null;
  }

  return (
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
  );
}

export default Sentry.wrap(RootLayout);
