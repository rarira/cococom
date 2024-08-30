import { Stack } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function AuthLayout() {
  const { styles } = useStyles(stylesheet);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: styles.content,
        headerStyle: styles.header,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="signin" options={{ title: 'Sign In' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
    </Stack>
  );
}

const stylesheet = createStyleSheet(theme => ({
  content: {
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.modalBackground,
  },
}));
