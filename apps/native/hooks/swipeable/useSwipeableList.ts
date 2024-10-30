import { useEffect, useRef } from 'react';
import { useFocusedTab } from 'react-native-collapsible-tab-view';
import { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { ItemDetailsTabNames } from '@/constants';

export function useSwipeableList(currentTabName: ItemDetailsTabNames) {
  const previousSwipeableRef = useRef<SwipeableMethods>(null);

  const focuedTabName = useFocusedTab();

  useEffect(() => {
    if (focuedTabName !== currentTabName) {
      previousSwipeableRef.current?.close();
    }
  }, [currentTabName, focuedTabName]);

  return {
    previousSwipeableRef,
  };
}
