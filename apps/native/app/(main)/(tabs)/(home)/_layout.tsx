import { router } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CloseButton from '@/components/custom/button/close';

export const unstable_settings = {
  initialRouteName: 'home',
};

export default function HomeLayout() {
  const { styles } = useStyles(stylesheet);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: styles.content,
        headerStyle: styles.header,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="home" options={{ title: '홈', headerShown: false }} />
      <Stack.Screen name="sales" />
      <Stack.Screen
        name="noti-center"
        options={{
          title: '알림 센터',
          presentation: 'modal',
          headerBackButtonDisplayMode: 'minimal',
          headerLeft: () => <CloseButton onPress={() => router.dismiss()} />,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <Stack.Screen name="item" />
    </Stack>
  );
}

const stylesheet = createStyleSheet(theme => ({
  content: {
    paddingTop: 0,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.modalBackground,
  },
  headerTitle: {
    color: theme.colors.typography,
  },
}));
