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
        headerShown: true,
        contentStyle: {
          paddingTop: 0,
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: '홈', headerShown: false }} />
      <Stack.Screen name="sales" />
      <Stack.Screen name="noti-center" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="item" />
    </Stack>
  );
}
