import { Stack } from 'expo-router';

export default function AuthSignUpLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="confirm"
        options={{
          title: '가입 정보 확인',
        }}
      />
    </Stack>
  );
}
