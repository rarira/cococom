import { useFonts } from 'expo-font';
import { useLayoutEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import Util from '@/libs/util';

console.log('Preventing auto hide splash screen...');
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

// Prevent the splash screen from auto-hiding before asset loading is complete.

export function useSplashScreen() {
  const [appIsReady] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter: require('../assets/fonts/Inter_18pt-Medium.ttf'),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (appIsReady) {
      (async () => {
        await Util.wait(5000);
        SplashScreen.hide();
      })();
    }
  }, [appIsReady]);

  return { appIsReady };
}
