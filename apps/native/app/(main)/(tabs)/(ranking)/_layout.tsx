import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'ranking',
};

export default function RankingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ranking" />
      <Stack.Screen name="item" options={{ headerShown: true }} />
    </Stack>
  );
}
