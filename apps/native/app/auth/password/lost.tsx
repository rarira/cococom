import { router } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import LostPasswordForm from '@/components/custom/form/password/lost';
import ScreenTitleText from '@/components/custom/text/screen-title';

export default function PasswordLostScreen() {
  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();

  const handleCompleted = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={styles.container(bottom)}>
      <ScreenTitleText style={styles.title}>
        비밀번호 재설정을 위해 가입하신 이메일 주소를 입력해주세요
      </ScreenTitleText>
      <LostPasswordForm onCompleted={handleCompleted} />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (bottom: number) => ({
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: bottom + theme.spacing.xl,
  }),
  title: {
    marginBottom: theme.spacing.md,
  },
}));
