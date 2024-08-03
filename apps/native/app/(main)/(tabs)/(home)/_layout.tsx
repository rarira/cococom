import { Stack } from 'expo-router/stack';
import { useStyles } from 'react-native-unistyles';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function HomeLayout() {
  const { theme } = useStyles();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.typography },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="index" options={{ title: '홈' }} />
      <Stack.Screen
        name="sales"
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
      <Stack.Screen name="details/[itemId]" options={{ headerShown: true }} />
    </Stack>
  );
}
