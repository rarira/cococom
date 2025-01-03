import { Stack } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function TermsLayout() {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Stack
      screenOptions={{
        headerTintColor: theme.colors.typography,
        contentStyle: styles.content,
        headerStyle: styles.header,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" options={{ title: '법적 고지사항' }} />
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
