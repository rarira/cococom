import * as Sentry from '@sentry/react-native';
import { useCallback } from 'react';

import { useUserStore } from '@/store/user';

export type Callback = (scope: Sentry.Scope) => void;

export function useErrorHandler() {
  const user = useUserStore(state => state.user);

  const reportToSentry = useCallback(
    (e: Error, stackTrace?: string, callback?: Callback | false) => {
      if (process.env.NODE_ENV === 'development') {
        return console.error(JSON.stringify(e, null, 2));
      }

      Sentry.withScope(scope => {
        scope.setUser(user);
        scope.setExtra('stackTrace', stackTrace);
        if (callback === false) {
          /** do nothing */
        } else if (callback) callback(scope);
        Sentry.captureException(e);
      });
    },
    [user],
  );

  return {
    reportToSentry,
  };
}
