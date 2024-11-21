import * as Sentry from '@sentry/react-native';
import { useCallback } from 'react';
// import * as Updates from 'expo-updates';

// const manifest = Updates.manifest;
// const metadata = 'metadata' in manifest ? manifest.metadata : undefined;
// const extra = 'metadata' in manifest ? manifest.extra : undefined;
// const updateGroup = metadata && 'updateGroup' in metadata ? metadata.updateGroup : undefined;

export type Callback = (scope: Sentry.Scope) => void;

export function useErrorHandler() {
  // const redirectToErrorScreen = use$ErrorHandler();
  // const store = useStore({ safeUse: true });

  const reportToSentry = useCallback(
    (e: Error, stackTrace?: string, callback?: Callback | boolean) => {
      if (process.env.NODE_ENV === 'development') {
        return console.error(JSON.stringify(e, null, 2));
      }

      if (callback === false) {
        /** do nothing */
      } else if (callback) Sentry.withScope(callback as Callback);

      Sentry.withScope(scope => {
        //  https://docs.expo.dev/guides/using-sentry/#do-you-want-to-append-additional-update-related
        // scope.setTag('expo-is-embedded-update', Updates.isEmbeddedLaunch);

        // if (typeof updateGroup === 'string') {
        //   scope.setTag('expo-update-group-id', updateGroup);

        //   const owner = extra?.expoClient?.owner ?? '[account]';
        //   const slug = extra?.expoClient?.slug ?? '[project]';
        //   scope.setTag(
        //     'expo-update-debug-url',
        //     `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`,
        //   );
        // } else if (Updates.isEmbeddedLaunch) {
        //   // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
        //   scope.setTag('expo-update-debug-url', 'not applicable for embedded updates');
        // }
        // scope.setTag('expo-update-id', Updates.updateId);
        // scope.setTag('expo-is-embedded-update', Updates.isEmbeddedLaunch);

        // if (typeof updateGroup === 'string') {
        //   scope.setTag('expo-update-group-id', updateGroup);

        //   const owner = extra?.expoClient?.owner ?? '[account]';
        //   const slug = extra?.expoClient?.slug ?? '[project]';
        //   scope.setTag(
        //     'expo-update-debug-url',
        //     `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`,
        //   );
        // } else if (Updates.isEmbeddedLaunch) {
        //   // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
        //   scope.setTag('expo-update-debug-url', 'not applicable for embedded updates');
        // }
        scope.setExtra('stackTrace', stackTrace);
      });

      Sentry.captureException(e);
    },
    [],
  );

  return {
    reportToSentry,
  };
}
