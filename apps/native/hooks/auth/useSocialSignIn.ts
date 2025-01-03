import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { login } from '@react-native-kakao/user';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Alert } from 'react-native';

import { useSignInWithIdToken } from '@/hooks/auth/useSignInWithIdToken';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useUserStore } from '@/store/user';

export function useSocialSignIn() {
  const [termsAgreed, setTermsAgreed] = useState(false);

  const { handleSignInWithIdToken } = useSignInWithIdToken();

  const { reportToSentry } = useErrorHandler();

  const setAuthProcessing = useUserStore(store => store.setAuthProcessing);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['profile', 'email'],
      webClientId: '786330080407-3rar2ftsuidv90h6pgq7g305349on0cc.apps.googleusercontent.com',
    });
  }, []);

  const checkTermsAgreed = useCallback((provider: 'Apple' | 'Google' | '카카오') => {
    Alert.alert(
      '약관 동의 필요',
      `이용약관 및 개인정보처리방침에 동의하셔야 ${provider} 로그인이 가능합니다.`,
    );
  }, []);

  const handlePressAppleLogin = useCallback(async () => {
    if (!termsAgreed) {
      checkTermsAgreed('Apple');
      return;
    }

    setAuthProcessing(true);

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        await handleSignInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
      } else {
        throw new Error('No identityToken.');
      }
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
        reportToSentry(error);
      }
    } finally {
      setAuthProcessing(false);
    }
  }, [checkTermsAgreed, handleSignInWithIdToken, reportToSentry, setAuthProcessing, termsAgreed]);

  const handlePressGoogleLogin = useCallback(async () => {
    if (!termsAgreed) {
      checkTermsAgreed('Google');
      return;
    }

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
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // setAuthProcessing(false);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // setAuthProcessing(false);
      } else {
        reportToSentry(error);
        // setAuthProcessing(false);
        // some other error happened
      }
    } finally {
      setAuthProcessing(false);
    }
  }, [checkTermsAgreed, handleSignInWithIdToken, reportToSentry, setAuthProcessing, termsAgreed]);

  const handlePressKakaoLogin = useCallback(async () => {
    if (!termsAgreed) {
      checkTermsAgreed('카카오');
      return;
    }

    setAuthProcessing(true);

    const result = await login();

    await handleSignInWithIdToken({
      provider: 'kakao',
      token: result.idToken!,
      access_token: result.accessToken,
    });

    setAuthProcessing(false);
  }, [checkTermsAgreed, handleSignInWithIdToken, setAuthProcessing, termsAgreed]);

  const handleTermsAgreedChange = useCallback(({ isChecked }: { isChecked: boolean }) => {
    setTermsAgreed(isChecked);
  }, []);

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

  return {
    handlePressAppleLogin,
    handlePressGoogleLogin,
    handlePressKakaoLogin,
    googleLogo,
    appleLogo,
    termsAgreed,
    handleTermsAgreedChange,
  };
}
