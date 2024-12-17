import { Stack } from 'expo-router';
import { useStyles } from 'react-native-unistyles';

import Button from '@/components/core/button';
import Text from '@/components/core/text';
import { useSignOut } from '@/hooks/auth/useSignOut';

export const unstable_settings = {
  initialRouteName: 'my',
};

export default function MyLayout() {
  const { theme } = useStyles();
  const signOut = useSignOut();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: theme.colors.typography,
        headerStyle: { backgroundColor: theme.colors.modalBackground },
      }}
    >
      <Stack.Screen name="my" />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          headerTitle: '프로필',
          headerBackButtonDisplayMode: 'minimal',
          headerRight: () => (
            <Button onPress={signOut}>
              <Text>로그아웃</Text>
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          headerTitle: '설정',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen name="item" options={{ headerShown: true }} />
    </Stack>
  );
}
