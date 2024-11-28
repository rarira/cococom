import { PortalHost } from '@gorhom/portal';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import HeaderBackButton from '@/components/custom/button/header/back';
import EmailSignUpForm from '@/components/custom/form/signup/email';
import ScreenTitleText from '@/components/custom/text/screen-title';
import { PortalHostNames } from '@/constants';
import Util from '@/libs/util';

export default function SignUpScreen() {
  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  const { from } = useLocalSearchParams<{ from: string }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => {
        return from === 'signin' ? (
          <HeaderBackButton text="로그인" onPress={() => router.replace('/auth/signin')} />
        ) : null;
      },
    });
  }, [from, navigation]);

  return (
    <>
      <StatusBar style={Util.isPlatform('ios') ? 'light' : 'auto'} />
      <View style={styles.container(bottom)}>
        <ScreenTitleText>환영합니다.아래 정보를 입력하여 회원가입을 진행하세요</ScreenTitleText>
        <EmailSignUpForm />
      </View>
      <PortalHost name={PortalHostNames.SIGN_UP} />
    </>
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
