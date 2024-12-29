import { useRef, useEffect } from 'react';

import { useRequestNotificationPermission } from './useRequestNotificationPermission';

export function useRequestPermissionInIntro(pageNo: number, activePageNo: number) {
  const { requestPermission } = useRequestNotificationPermission(true);

  const isInFocusRef = useRef(false);
  const isPermissionRequestedRef = useRef(false);

  useEffect(() => {
    if (isPermissionRequestedRef.current) return;

    if (pageNo === activePageNo) {
      isInFocusRef.current = true;
    }
    if (isInFocusRef.current && pageNo !== activePageNo) {
      requestPermission();
      isInFocusRef.current = false;
      isPermissionRequestedRef.current = true;
    }
  }, [activePageNo, pageNo, requestPermission]);
}
