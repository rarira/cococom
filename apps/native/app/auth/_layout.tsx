import { Stack } from 'expo-router';
import { useStyles } from 'react-native-unistyles';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function AuthLayout() {
  const { theme } = useStyles();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="signin" options={{ title: 'Sign In' }} />
    </Stack>
  );
}
