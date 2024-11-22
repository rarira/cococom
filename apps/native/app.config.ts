import { ConfigContext, ExpoConfig } from 'expo/config';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

function getSupabaseEnv(env: 'LOCAL' | 'PREVIEW' | 'PRODUCTION') {
  switch (env) {
    case 'PREVIEW':
      return {
        env,
        url: process.env.EXPO_PUBLIC_SUPABASE_PREVIEW_URL,
        anonKey: process.env.EXPO_PUBLIC_SUPABASE_PREVIEW_ANON_KEY,
      };
    case 'PRODUCTION':
      return {
        env,
        url: process.env.EXPO_PUBLIC_SUPABASE_PRODUCTION_URL,
        anonKey: process.env.EXPO_PUBLIC_SUPABASE_PRODUCTION_ANON_KEY,
      };
    case 'LOCAL':
    default:
      return {
        env,
        url: process.env.EXPO_PUBLIC_SUPABASE_URL,
        anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      };
  }
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const supabaseEnv = getSupabaseEnv(process.env.supabaseEnv as 'LOCAL' | 'PREVIEW' | 'PRODUCTION');
  console.log({ supabaseEnv });
  return {
    ...config,
    name: 'cococom',
    slug: 'cococom',
    newArchEnabled: true,
    plugins: [
      'expo-router',
      '@react-native-firebase/app',
      '@react-native-firebase/crashlytics',
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
      'expo-font',
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
      supabase: supabaseEnv,
      kakao: {
        nativeAppKey: process.env.KAKAO_TEST_NATIVE_APP_KEY,
      },
    },
    updates: {
      url: 'https://u.expo.dev/aad6f74a-0f9e-4ef0-9fb3-2a19791cb1ec',
    },
  };
};
