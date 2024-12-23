import { useRef, useEffect } from 'react';

import { useRequestNotificationPermission } from './useRequestNotificationPermission';

export function useRequestPermissionInIntro(pageNo: number, activePageNo: number) {
  const { requestPermission } = useRequestNotificationPermission(true);

  const isInFocusRef = useRef(false);
  const isPermissionRequestedRef = useRef(false);

  useEffect(() => {
    if (isPermissionRequestedRef.current) return;

    if (pageNo === activePageNo) {
      console.log('set isInFocusRef.current = true');
      isInFocusRef.current = true;
    }
    if (isInFocusRef.current && pageNo !== activePageNo) {
      console.log('pagerView swiped, call requestPermission');
      requestPermission();
      isInFocusRef.current = false;
      isPermissionRequestedRef.current = true;
    }
  }, [activePageNo, pageNo, requestPermission]);
}
