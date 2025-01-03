import { ConfigContext, ExpoConfig } from 'expo/config';

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
        env: 'LOCAL',
        url: process.env.EXPO_PUBLIC_SUPABASE_URL,
        anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      };
  }
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const supabaseEnv = getSupabaseEnv(
    process.env.SUPABASE_ENV as 'LOCAL' | 'PREVIEW' | 'PRODUCTION',
  );
  return {
    ...config,
    name: '코코컴',
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
          nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_TEST_NATIVE_APP_KEY,
          android: {
            authCodeHandlerActivity: true,
          },
          ios: {
            handleKakaoOpenUrl: true,
          },
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#FFFFFF',
          image: './assets/images/splash-screen.png',
          dark: {
            image: './assets/images/splash-screen.png',
            backgroundColor: '#000000',
          },
          imageWidth: 250,
          android: {
            backgroundColor: '#FFFFFF',
            image: './assets/images/adaptiveIcon-foreground.png',
            dark: {
              image: './assets/images/adaptiveIcon-foreground.png',
              backgroundColor: '#000000',
            },
            imageWidth: 250,
          },
        },
      ],
      '@react-native-google-signin/google-signin',
      'expo-apple-authentication',
      'expo-notifications',
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
    },
    updates: {
      url: 'https://u.expo.dev/aad6f74a-0f9e-4ef0-9fb3-2a19791cb1ec',
    },
  };
};
