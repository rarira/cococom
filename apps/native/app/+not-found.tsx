import { Link, Stack, usePathname } from 'expo-router';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useEffect } from 'react';

import Text from '@/components/core/text';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export default function NotFoundScreen() {
  const { styles } = useStyles(stylesheet);
  const pathname = usePathname();
  const { reportToSentry } = useErrorHandler();

  useEffect(() => {
    reportToSentry(new Error(`Not Found: ${pathname}`));
  }, [pathname, reportToSentry]);

  return (
    <>
      <Stack.Screen
        options={{
          title: '이런!',
          headerBackButtonDisplayMode: 'minimal',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <View style={styles.container}>
        <Text type="title">{`${pathname}: 화면이 존재하지 않습니다.`}</Text>
        <Link href="/home" style={styles.link}>
          <Text type="link">홈화면으로 돌아갑니다!</Text>
        </Link>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  header: {
    backgroundColor: theme.colors.modalBackground,
  },
  headerTitle: {
    color: theme.colors.typography,
  },
}));
