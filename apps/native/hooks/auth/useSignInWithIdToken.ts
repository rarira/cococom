import { router } from 'expo-router';
import { useCallback } from 'react';

import { getProfile, supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

type SignInWithIdTokenCredentials = {
  /** Provider name or OIDC `iss` value identifying which provider should be used to verify the provided token. Supported names: `google`, `apple`, `azure`, `facebook`, `keycloak` (deprecated). */
  provider: 'google' | 'apple' | 'azure' | 'facebook' | string;
  /** OIDC ID token issued by the specified provider. The `iss` claim in the ID token must match the supplied provider. Some ID tokens contain an `at_hash` which require that you provide an `access_token` value to be accepted properly. If the token contains a `nonce` claim you must supply the nonce used to obtain the ID token. */
  token: string;
  /** If the ID token contains an `at_hash` claim, then the hash of this value is compared to the value in the ID token. */
  access_token?: string;
  /** If the ID token contains a `nonce` claim, then the hash of this value is compared to the value in the ID token. */
  nonce?: string;
  options?: {
    /** Verification token received when the user completes the captcha on the site. */
    captchaToken?: string;
  };
};

export function useSingInWithIdToken() {
  const { setUser, setProfile, callbackAfterSignIn, setCallbackAfterSignIn } = useUserStore();

  const handleSignInWithIdToken = useCallback(
    async (credentials: SignInWithIdTokenCredentials) => {
      const {
        data: { user },
        error,
      } = await supabase.signInWithIdToken(credentials);

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
        router.dismiss();
      }
    },
    [callbackAfterSignIn, setCallbackAfterSignIn, setProfile, setUser],
  );

  return { handleSignInWithIdToken };
}
