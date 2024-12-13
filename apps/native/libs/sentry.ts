import { isRunningInExpoGo } from 'expo';
import * as Updates from 'expo-updates';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

export const reactNavigationIntegration = Sentry.reactNavigationIntegration();

const manifest = Updates.manifest;
const metadata = 'metadata' in manifest ? manifest.metadata : undefined;
const extra = 'extra' in manifest ? manifest.extra : undefined;
const updateGroup = metadata && 'updateGroup' in metadata ? metadata.updateGroup : undefined;

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableNativeFramesTracking: !isRunningInExpoGo(),
  integrations: [reactNavigationIntegration],
  environment: Updates.channel ?? process.env.EAS_BUILD_PROFILE ?? 'development',
  release: Constants.expoConfig?.version,
  // dist: Constants.expoConfig?.version,
});

const scope = Sentry.getCurrentScope();
scope.setTag('expo-update-id', Updates.updateId);
scope.setTag('expo-is-embedded-update', Updates.isEmbeddedLaunch);

if (typeof updateGroup === 'string') {
  scope.setTag('expo-update-group-id', updateGroup);

  const owner = extra?.expoClient?.owner ?? '[account]';
  const slug = extra?.expoClient?.slug ?? '[project]';
  scope.setTag(
    'expo-update-debug-url',
    `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`,
  );
} else if (Updates.isEmbeddedLaunch) {
  // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
  scope.setTag('expo-update-debug-url', 'not applicable for embedded updates');
}

export default Sentry;
