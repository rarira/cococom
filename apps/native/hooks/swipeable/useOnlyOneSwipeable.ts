import { MutableRefObject, useCallback, useRef } from 'react';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';

export function useOnlyOneSwipeable(
  previousSwipeableRef: MutableRefObject<SwipeableMethods | null>,
) {
  const swipeRef = useRef<SwipeableMethods>(null);

  const handleSwipeableWillOpen = useCallback(() => {
    if (!!previousSwipeableRef.current) {
      if (previousSwipeableRef.current !== swipeRef.current) {
        previousSwipeableRef.current?.close();
      }
    }
  }, [previousSwipeableRef]);

  const handleSwipeableOpen = () => {
    previousSwipeableRef.current = swipeRef.current!;
  };

  return {
    ref: swipeRef,
    onSwipeableWillOpen: handleSwipeableWillOpen,
    onSwipeableOpen: handleSwipeableOpen,
  };
}
