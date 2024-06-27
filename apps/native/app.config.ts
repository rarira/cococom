import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'cococom',
  slug: 'cococom',
  plugins: [
    'expo-router',
    '@react-native-firebase/app',
    [
      '@sentry/react-native/expo',
      {
        organization: process.env.EXPO_PUBLIC_SENTRY_ORG,
        project: process.env.EXPO_PUBLIC_SENTRY_PROJECT,
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    './plugins',
  ],
});
