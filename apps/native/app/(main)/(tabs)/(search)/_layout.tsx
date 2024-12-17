import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'search',
};

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search" />
      <Stack.Screen name="item" options={{ headerShown: true }} />
    </Stack>
  );
}
