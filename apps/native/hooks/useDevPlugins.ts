import { useMMKVDevTools } from '@dev-plugins/react-native-mmkv';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { NavigationContainerRef } from '@react-navigation/native';
import { QueryClient } from '@tanstack/react-query';
import { RefObject } from 'react';

export function useDevPlugins({
  queryClient,
  navigationRef,
}: {
  queryClient: QueryClient;
  navigationRef: RefObject<NavigationContainerRef<any>>;
}) {
  useReactQueryDevTools(queryClient);
  useReactNavigationDevTools(navigationRef);
  useMMKVDevTools();
}
