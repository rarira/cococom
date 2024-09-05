import { Image } from 'expo-image';
import { router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';

import CloseButton from '@/components/custom/button/close';
import SignInForm from '@/components/custom/form/signin';
import ScreenTitleText from '@/components/custom/text/screen-title';
import Button from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import Text from '@/components/ui/text';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

const LOGIN_IMAGE_HEIGHT = 36;

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);

  const { styles } = useStyles(stylesheet);
  const { setUser, callbackAfterSignIn, setCallbackAfterSignIn, setProfile } = useUserStore();
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={() => router.dismiss()} />,
      headerRight: () => (
        <Button onPress={() => router.push('/auth/signup')}>
          <Text>회원 가입</Text>
        </Button>
      ),
    } as any);
  }, [navigation]);

  const handlePressKakaoLogin = useCallback(async () => {
    const result = await login();

    const {
      data: { user },
      error,
    } = await supabase.signInWithIdToken({
      provider: 'kakao',
      token: result.idToken!, // OpenID Connect 활성화 필요
      access_token: result.accessToken,
    });

    const profile = await supabase.fetchData<'profiles'>(
      {
        column: 'id',
        value: user?.id!,
      },
      'profiles',
    );

    if (!error) {
      if (user) {
        setUser(user);
        setProfile(profile);
        if (!profile.confirmed) {
          return router.replace({
            pathname: '/auth/signup/confirm',
            params: { provider: 'kakao' },
          });
        }

        if (callbackAfterSignIn) {
          callbackAfterSignIn(user);
          setCallbackAfterSignIn(null);
        }
        router.dismiss();
      }
    }
  }, [callbackAfterSignIn, setCallbackAfterSignIn, setProfile, setUser]);

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
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <View style={styles.container(bottom)}>
        <ScreenTitleText>회원가입 시 입력한 정보를 입력하세요</ScreenTitleText>
        <SignInForm loading={loading} setLoading={setLoading} />
        <Divider style={styles.divider} />
        <View style={styles.socialLogin}>
          <Button disabled={loading} style={styles.appleLoginButton}>
            <Image source={appleLogo} style={styles.appleLoginImage} contentFit="contain" />
          </Button>
          <Button disabled={loading} style={styles.googleLoginButton}>
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
    </>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (bottomInset: number) => ({
    flex: 1,
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingTop: theme.spacing.lg,
    paddingBottom: bottomInset + theme.spacing.lg,
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
