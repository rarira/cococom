import { Stack } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'signin',
};

export default function AuthLayout() {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Stack
      screenOptions={{
        headerTintColor: theme.colors.typography,
        contentStyle: styles.content,
        headerStyle: styles.header,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="signin" options={{ title: '로그인' }} />
      <Stack.Screen
        name="signup/index"
        options={{
          headerBackVisible: true,
          title: '회원가입',
        }}
      />
      <Stack.Screen
        name="signup/confirm"
        options={{ title: '회원가입 확인', headerBackVisible: false }}
      />
      <Stack.Screen
        name="password/change"
        options={{ title: '비밀번호 변경', headerBackVisible: true }}
      />
      <Stack.Screen
        name="password/lost"
        options={{ title: '비밀번호 재설정 요청', headerBackVisible: true }}
      />
      <Stack.Screen
        name="password/reset"
        options={{ title: '비밀번호 재설정', headerBackVisible: false }}
      />
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
