import { useCallback, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';

export function usePagerViewNavigation() {
  const [activePage, setActivePage] = useState<number>(0);

  const pagerViewRef = useRef<PagerView>(null);

  const handlePageSelected = useCallback(
    ({ nativeEvent }: { nativeEvent: { position: number } }) => {
      setActivePage(nativeEvent.position);
    },
    [],
  );

  const handleNavigateToPage = useCallback((page: number) => {
    pagerViewRef.current?.setPage(page);
  }, []);

  return {
    activePage,
    pagerViewRef,
    handlePageSelected,
    handleNavigateToPage,
  };
}
