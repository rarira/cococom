import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles } from 'react-native-unistyles';

export default function MainLayout() {
  const { theme } = useStyles();
  const { top } = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.typography },
        contentStyle: {
          paddingTop: top,
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ title: '홈', headerShown: false }} />
      <Stack.Screen
        name="sales"
        // options={{ headerShown: true, title: 'Search' }}
        options={
          (({ route }: any) => {
            //https://github.com/expo/expo/pull/30074
            const { categorySector } = route.params;
            return {
              title: categorySector,
              headerShown: true,
              contentStyle: { paddingTop: 0 },
            };
          }) as any
        }
      />
    </Stack>
  );
}
