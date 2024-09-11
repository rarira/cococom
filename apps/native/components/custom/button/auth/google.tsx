import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { getProfile, supabaseClient } from '@/libs/supabase';
import { useUserStore } from '@/store/user';
interface GoogleAuthButtonProps {}

const GoogleAuthButton = memo(function GoogleAuthButton({}: GoogleAuthButtonProps) {
  const { styles } = useStyles(stylesheet);

  const { setUser, setProfile, callbackAfterSignIn, setCallbackAfterSignIn, setAuthProcessing } =
    useUserStore();

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      style={styles.container}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const { data: userInfo } = await GoogleSignin.signIn();
          if (userInfo?.idToken) {
            const {
              data: { user },
              error,
            } = await supabaseClient.auth.signInWithIdToken({
              provider: 'google',
              token: userInfo.idToken,
            });

            if (!error && user) {
              const profile = await getProfile(user.id);
              setProfile(profile);
              if (!profile?.confirmed) {
                return router.replace({
                  pathname: '/auth/signup/confirm',
                  params: { provider: 'kakao' },
                });
              } else if (callbackAfterSignIn) {
                callbackAfterSignIn(user);
                setCallbackAfterSignIn(null);
              }
              setUser(user);
              setAuthProcessing(false);
              router.dismiss();
            }
          } else {
            throw new Error('no ID token present!');
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
  },
}));

export default GoogleAuthButton;
