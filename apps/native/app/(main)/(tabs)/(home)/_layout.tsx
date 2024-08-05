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
        contentStyle: {
          paddingTop: 0,
          backgroundColor: theme.colors.background,
        },
      }}
      // initialRouteName="index"
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
              headerStyle: { backgroundColor: theme.colors.modalBackground },
              headerTitleStyle: { color: theme.colors.typography },
            };
          }) as any
        }
      />
      <Stack.Screen name="item" options={{ headerShown: true }} />
    </Stack>
  );
}
