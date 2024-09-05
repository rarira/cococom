import { router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CloseButton from '@/components/custom/button/close';
import SignInForm from '@/components/custom/form/signin';
import ScreenTitleText from '@/components/custom/text/screen-title';
import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);

  const { styles } = useStyles(stylesheet);
  const { setUser, callbackAfterSignIn, setCallbackAfterSignIn, setProfile } = useUserStore();
  const navigation = useNavigation();

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session, user },
      error,
    } = await supabase.signUpWithEmail({
      email: email,
      password: password,
      options: {
        data: { nickname },
      },
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    if (user) {
      setUser(user);
      if (callbackAfterSignIn) {
        callbackAfterSignIn(user);
        setCallbackAfterSignIn(null);
      }
    }
    setLoading(false);
    router.dismiss();
  }

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

  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <View style={styles.container}>
        <ScreenTitleText>회원가입 시 입력한 정보를 입력하세요</ScreenTitleText>
        <SignInForm />
        <View style={styles.verticallySpaced}>
          <Button title="Sign in with kakao" disabled={loading} onPress={handlePressKakaoLogin} />
        </View>
        <View style={styles.verticallySpaced}>
          <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
        </View>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
}));
