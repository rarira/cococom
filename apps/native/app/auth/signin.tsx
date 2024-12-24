import { Image } from 'expo-image';
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button from '@/components/core/button';
import Divider from '@/components/core/divider';
import Text from '@/components/core/text';
import CloseButton from '@/components/custom/button/close';
import ResetPasswordButton from '@/components/custom/button/reset-password';
import SignInForm from '@/components/custom/form/signin';
import ScreenTitleText from '@/components/custom/text/screen-title';
import ModalScreenContainer from '@/components/custom/view/container/screen/modal';
import Util from '@/libs/util';
import { useSocialSignIn } from '@/hooks/auth/useSocialSignIn';

const LOGIN_IMAGE_HEIGHT = 36;

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);

  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={() => router.dismiss()} />,
      headerRight: () => (
        //TODO: https://github.com/software-mansion/react-native-screens/issues/2219#issuecomment-2481628312
        <Button
          {...(Util.isPlatform('android')
            ? { onPressOut: () => router.replace('/auth/signup?from=signin') }
            : { onPress: () => router.replace('/auth/signup?from=signin') })}
        >
          <Text>회원 가입</Text>
        </Button>
      ),
    } as any);
  }, [navigation]);

  const {
    handlePressAppleLogin,
    handlePressGoogleLogin,
    handlePressKakaoLogin,
    googleLogo,
    appleLogo,
  } = useSocialSignIn();

  return (
    <ModalScreenContainer>
      <View style={styles.container(bottom)}>
        <ScreenTitleText>이메일 혹은 소셜 로그인하세요</ScreenTitleText>
        <SignInForm loading={loading} setLoading={setLoading} />
        <ResetPasswordButton />
        <Divider style={styles.divider} />
        <View style={styles.socialLogin}>
          <Button
            disabled={loading}
            style={styles.appleLoginButton}
            onPress={handlePressAppleLogin}
          >
            <Image source={appleLogo} style={styles.appleLoginImage} contentFit="contain" />
          </Button>
          <Button
            disabled={loading}
            style={styles.googleLoginButton}
            onPress={handlePressGoogleLogin}
          >
            <Image source={googleLogo} style={styles.googleLoginImage} contentFit="contain" />
            <Text style={styles.googleLoginText}>Google 계정으로 로그인</Text>
          </Button>
          <Button
            disabled={loading}
            onPress={handlePressKakaoLogin}
            style={styles.kakaoLoginButton}
          >
            <Image
              source={require('@/assets/images/social/kakao_login.png')}
              style={styles.kakaoLoginImage}
              contentFit="contain"
            />
          </Button>
        </View>
      </View>
    </ModalScreenContainer>
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
  divider: {
    marginTop: theme.spacing.xl,
  },
  socialLogin: {
    marginTop: theme.spacing.lg,
  },
  appleLoginButton: {
    width: '100%',
    height: LOGIN_IMAGE_HEIGHT,
    backgroundColor: theme.colors.appleBackground,
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.lightShadow,
    overflow: 'hidden',
  },
  appleLoginImage: {
    width: '100%',
    height: LOGIN_IMAGE_HEIGHT + 2,
  },
  googleLoginButton: {
    width: '100%',
    height: LOGIN_IMAGE_HEIGHT,
    backgroundColor: theme.colors.googleBackground,
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.lightShadow,
    overflow: 'hidden',
  },
  googleLoginImage: {
    width: LOGIN_IMAGE_HEIGHT - 2,
    height: LOGIN_IMAGE_HEIGHT - 2,
  },
  googleLoginText: {
    fontSize: theme.fontSize.normal,
  },
  kakaoLoginButton: {
    width: '100%',
    height: LOGIN_IMAGE_HEIGHT,
    backgroundColor: '#FEE500',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    opacity: 1,
  },
  kakaoLoginImage: {
    width: '100%',
    height: LOGIN_IMAGE_HEIGHT + 10,
    margin: 0,
    left: theme.spacing.xl,
  },
}));
