import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'cococom',
  slug: 'cococom',
  // TODO: https://github.com/rarira/cococom/issues/16 해결되야 newArchEnabled: true로 변경 가능
  newArchEnabled: true,
  plugins: [
    'expo-router',
    '@react-native-firebase/app',
    '@react-native-firebase/crashlytics',
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
        android: {
          extraMavenRepos: ['https://devrepo.kakao.com/nexus/content/groups/public/'],
        },
      },
    ],
    [
      '@react-native-kakao/core',
      {
        nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_TEST_NATIVE_APP_KEY,
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
    googleServicesFile:
      process.env.GOOGLE_SERVICES_INFO ?? './assets/firebase/GoogleService-Info.plist',
  },
  android: {
    ...config.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? './assets/firebase/google-services.json',
  },
  extra: {
    ...config.extra,
    sentry: {
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    },
    supabase: {
      env: process.env.EXPO_PUBLIC_SUPABASE_ENV,
      url:
        process.env.EXPO_PUBLIC_SUPABASE_ENV === 'LOCAL'
          ? process.env.EXPO_PUBLIC_SUPABASE_URL
          : process.env[`EXPO_PUBLIC_SUPABASE_${process.env.EXPO_PUBLIC_SUPABASE_ENV}_URL`],
      anonKey:
        process.env.EXPO_PUBLIC_SUPABASE_ENV === 'LOCAL'
          ? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
          : process.env[`EXPO_PUBLIC_SUPABASE_${process.env.EXPO_PUBLIC_SUPABASE_ENV}_ANON_KEY`],
    },
    kakao: {
      nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_TEST_NATIVE_APP_KEY,
    },
  },
});
