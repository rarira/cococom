import { useCallback, useEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { throttle } from 'es-toolkit';

import { useUiStore } from '@/store/ui';

export function useScrollAwareTabBar() {
  const setTabBarVisible = useUiStore(state => state.setTabBarVisible);
  const currentOffsetYRef = useRef(0);
  const throttleedFunctionRef = useRef<ReturnType<typeof throttle> | null>(null);

  useEffect(() => {
    return () => {
      throttleedFunctionRef.current?.cancel();
      currentOffsetYRef.current = 0;
    };
  }, []);

  const handleScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const throttleedFunction = throttle(() => {
        const { contentOffset } = nativeEvent;
        const { y } = contentOffset;

        if (y > currentOffsetYRef.current) {
          setTabBarVisible(false);
        } else if (y < currentOffsetYRef.current) {
          setTabBarVisible(true);
        }

        currentOffsetYRef.current = y;
      }, 100);

      throttleedFunctionRef.current = throttleedFunction;

      throttleedFunction();
    },
    [setTabBarVisible],
  );

  const handleMomentumScrollEnd = useCallback(() => {
    throttleedFunctionRef.current?.cancel();
    setTabBarVisible(true);
  }, [setTabBarVisible]);

  return { handleScroll, handleMomentumScrollEnd };
}
