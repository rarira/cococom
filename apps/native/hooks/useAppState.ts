import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState(callback: (status: AppStateStatus) => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', callback);

    return () => subscription.remove();
  }, [callback]);
}
