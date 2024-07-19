import { Stack } from 'expo-router/stack';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, headerStyle: { backgroundColor: 'black' } }}
      initialRouteName="index"
    >
      <Stack.Screen name="index" options={{ title: '홈' }} />
      <Stack.Screen name="sales" options={{ headerShown: true }} />
    </Stack>
  );
}
