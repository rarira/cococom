import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "cococom",
  slug: "cococom",
  plugins: [
    "expo-router",
    [
      "@sentry/react-native/expo",
      {
        organization: process.env.EXPO_PUBLIC_SENTRY_ORG,
        project: process.env.EXPO_PUBLIC_SENTRY_PROJECT,
      },
    ],
  ],
});
