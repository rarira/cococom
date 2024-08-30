import { Stack } from 'expo-router';
import { useStyles } from 'react-native-unistyles';

export default function MainLayout() {
  const { theme } = useStyles();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.modalBackground },
        headerTitleStyle: { color: theme.colors.typography },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ title: '홈', headerShown: false }} />
      {/* <Stack.Screen
        name="details"
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack>
  );
}
