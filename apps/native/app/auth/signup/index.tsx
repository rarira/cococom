import { PortalHost } from '@gorhom/portal';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import HeaderBackButton from '@/components/custom/button/header/back';
import EmailSignUpForm from '@/components/custom/form/signup/email';
import ScreenTitleText from '@/components/custom/text/screen-title';
import { PORTAL_HOST_NAMES } from '@/constants';
import StatusBar from '@/components/custom/status-bar';
import Button from '@/components/core/button';
import Text from '@/components/core/text';
import { useWalkthroughStore } from '@/store/walkthrough';

type SignUpScreenParams = {
  from: 'signin' | 'intro';
};

export default function SignUpScreen() {
  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const setFlags = useWalkthroughStore(state => state.setFlags);
  const { from } = useLocalSearchParams<SignUpScreenParams>();

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

  const handlePressSignIn = useCallback(() => {
    router.replace('/auth/signin');
    setFlags('intro', true);
  }, [setFlags]);

  const handlePressStart = useCallback(() => {
    router.replace('/home');
    setFlags('intro', true);
  }, [setFlags]);

  return (
    <>
      <StatusBar />
      <View style={styles.container(bottom)}>
        <ScreenTitleText>{`환영합니다.${from === 'intro' ? '\n모든 기능을 이용하기 위해서는 회원가입이 필요합니다. ' : '\n'}아래 정보를 입력하여 회원가입을 진행하세요`}</ScreenTitleText>
        <EmailSignUpForm />
        {from === 'intro' && (
          <View style={styles.introButtonsContainer}>
            <Button onPress={handlePressSignIn}>
              <Text style={styles.loginButtonText}>이미 계정이 있어요. 로그인할게요</Text>
            </Button>
            <Button onPress={handlePressStart}>
              <Text style={styles.loginButtonText}>회원가입은 잠시 미룰게요</Text>
            </Button>
          </View>
        )}
      </View>
      <PortalHost name={PORTAL_HOST_NAMES.SIGN_UP} />
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
  introButtonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  loginButtonText: {
    color: theme.colors.typography,
    fontSize: theme.fontSize.normal,
    textDecorationLine: 'underline',
  },
}));
