import { useMMKVDevTools } from '@dev-plugins/react-native-mmkv';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { useNavigationContainerRef } from 'expo-router';
import { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { reactNavigationIntegration } from '@/libs/sentry';

export function useDevPlugins({ queryClient }: { queryClient: QueryClient }) {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (navigationRef) {
      reactNavigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [navigationRef]);

  useReactQueryDevTools(queryClient);
  useReactNavigationDevTools(navigationRef);
  useMMKVDevTools();
}
