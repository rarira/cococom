import { useFonts } from 'expo-font';
import { useLayoutEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export function useSplashScreen() {
  const [appIsReady] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter: require('../assets/fonts/Inter_18pt-Medium.ttf'),
  });

  useLayoutEffect(() => {
    if (appIsReady) {
      (async () => {
        SplashScreen.hide();
      })();
    }
  }, [appIsReady]);

  return { appIsReady };
}
