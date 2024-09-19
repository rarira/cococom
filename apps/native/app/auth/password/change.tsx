import { router, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CloseButton from '@/components/custom/button/close';
import ChangePasswordForm from '@/components/custom/form/change-password';
import ScreenTitleText from '@/components/custom/text/screen-title';

export default function PasswordChangeScreen() {
  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={() => router.dismiss()} />,
    } as any);
  }, [navigation]);

  const handleCompleted = useCallback(() => router.dismiss(), []);

  return (
    <View style={styles.container(bottom)}>
      <ScreenTitleText>새로운 비밀번호로 변경합니다</ScreenTitleText>
      <ChangePasswordForm onCompleted={handleCompleted} />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (bottomInset: number) => ({
    flex: 1,
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: bottomInset + theme.spacing.xl,
    backgroundColor: theme.colors.background,
  }),
}));
