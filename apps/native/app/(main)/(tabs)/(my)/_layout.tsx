import { Stack } from 'expo-router';
import { useStyles } from 'react-native-unistyles';

import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { useSignOut } from '@/hooks/auth/useSingOut';

export default function MyLayout() {
  const { theme } = useStyles();
  const signOut = useSignOut();

  return (
    <Stack screenOptions={{ headerShown: false, headerTintColor: theme.colors.typography }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          headerTitle: '프로필',
          headerBackTitleVisible: false,
          headerRight: () => (
            <Button onPress={signOut}>
              <Text>로그아웃</Text>
            </Button>
          ),
        }}
      />
    </Stack>
  );
}
