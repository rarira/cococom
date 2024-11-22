import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { login } from '@react-native-kakao/user';
import { Image } from 'expo-image';
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';

import Button from '@/components/core/button';
import Divider from '@/components/core/divider';
import Text from '@/components/core/text';
import CloseButton from '@/components/custom/button/close';
import ResetPasswordButton from '@/components/custom/button/reset-password';
import SignInForm from '@/components/custom/form/signin';
import ScreenTitleText from '@/components/custom/text/screen-title';
import ModalScreenContainer from '@/components/custom/view/container/screen/modal';
import { useSignInWithIdToken } from '@/hooks/auth/useSignInWithIdToken';
import { useUserStore } from '@/store/user';

const LOGIN_IMAGE_HEIGHT = 36;

export default function SignInScreen() {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['profile', 'email'],
      webClientId: '786330080407-3rar2ftsuidv90h6pgq7g305349on0cc.apps.googleusercontent.com',
    });
  }, []);

  const [loading, setLoading] = useState(false);

  const { styles } = useStyles(stylesheet);
  const setAuthProcessing = useUserStore(store => store.setAuthProcessing);
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();

  const { handleSignInWithIdToken } = useSignInWithIdToken();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={() => router.dismiss()} />,
      headerRight: () => (
        <Button onPress={() => router.replace('/auth/signup?from=signin')}>
          <Text>회원 가입</Text>
        </Button>
      ),
    } as any);
  }, [navigation]);

  const handlePressGoogleLogin = useCallback(async () => {
    setAuthProcessing(true);

    try {
      await GoogleSignin.hasPlayServices();
      const { data: userInfo } = await GoogleSignin.signIn();
      if (userInfo?.idToken) {
        await handleSignInWithIdToken({
          provider: 'google',
          token: userInfo.idToken,
        });
      }
    } catch (error: any) {
      console.error('google sign in error', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setAuthProcessing(false);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setAuthProcessing(false);
      } else {
        setAuthProcessing(false);
        // some other error happened
      }
    } finally {
      setAuthProcessing(false);
    }
  }, [handleSignInWithIdToken, setAuthProcessing]);

  const handlePressKakaoLogin = useCallback(async () => {
    setAuthProcessing(true);

    const result = await login();

    await handleSignInWithIdToken({
      provider: 'kakao',
      token: result.idToken!,
      access_token: result.accessToken,
    });

    setAuthProcessing(false);
  }, [handleSignInWithIdToken, setAuthProcessing]);

  const googleLogo = useMemo(
    () =>
      UnistylesRuntime.themeName === 'light'
        ? require('@/assets/images/social/google_logo_light.png')
        : require('@/assets/images/social/google_logo_dark.png'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [UnistylesRuntime.themeName],
  );

  const appleLogo = useMemo(
    () =>
      UnistylesRuntime.themeName === 'light'
        ? require('@/assets/images/social/appleid_button_light.png')
        : require('@/assets/images/social/appleid_button_dark.png'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [UnistylesRuntime.themeName],
  );

  return (
    <ModalScreenContainer>
      <View style={styles.container(bottom)}>
        <ScreenTitleText>이메일 혹은 소셜 로그인하세요</ScreenTitleText>
        <SignInForm loading={loading} setLoading={setLoading} />
        <ResetPasswordButton />
        <Divider style={styles.divider} />
        <View style={styles.socialLogin}>
          <Button disabled={loading} style={styles.appleLoginButton}>
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
  },
  kakaoLoginImage: {
    width: '100%',
    height: LOGIN_IMAGE_HEIGHT + 10,
    margin: 0,
    left: theme.spacing.xl,
  },
}));
