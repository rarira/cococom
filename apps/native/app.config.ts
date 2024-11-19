import { ConfigContext, ExpoConfig } from 'expo/config';

const variant = process.env.APP_VARIANT?.toUpperCase() ?? 'DEVELOPMENT';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'cococom',
  slug: 'cococom',
  // TODO: https://github.com/rarira/cococom/issues/16 해결되야 newArchEnabled: true로 변경 가능
  newArchEnabled: false,
  plugins: [
    'expo-router',
    '@react-native-firebase/app',
    [
      '@sentry/react-native/expo',
      {
        organization: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
        android: {
          extraMavenRepos: ['https://devrepo.kakao.com/nexus/content/groups/public/'],
        },
      },
    ],
    [
      '@react-native-kakao/core',
      {
        nativeAppKey: process.env.KAKAO_TEST_NATIVE_APP_KEY,
        android: {
          authCodeHandlerActivity: true,
        },
        ios: {
          handleKakaoOpenUrl: true,
        },
      },
    ],
    '@react-native-google-signin/google-signin',
    'expo-apple-authentication',
    './plugins',
  ],
  ios: {
    ...config.ios,
    googleServicesFile: './assets/firebase/GoogleService-Info.plist',
  },
  android: {
    ...config.android,
    googleServicesFile: './assets/firebase/google-services.json',
  },
  extra: {
    ...config.extra,
    variant,
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
    supabase: {
      url: process.env[`SUPABASE_${variant}_URL`],
      anonKey: process.env[`SUPABASE_${variant}_ANON_KEY`],
    },
    kakao: {
      nativeAppKey: process.env.KAKAO_TEST_NATIVE_APP_KEY,
    },
  },
});
