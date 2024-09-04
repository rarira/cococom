import { Stack } from 'expo-router';

export default function RankingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="item" options={{ headerShown: true }} />
    </Stack>
  );
}
