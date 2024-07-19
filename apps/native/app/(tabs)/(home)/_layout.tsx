import { Stack } from 'expo-router/stack';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="[categorySector]" />
    </Stack>
  );
}
