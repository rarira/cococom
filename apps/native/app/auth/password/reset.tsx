import { Session } from '@cococom/supabase/types';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CircularProgress from '@/components/core/progress/circular';
import CloseButton from '@/components/custom/button/close';
import ChangePasswordForm from '@/components/custom/form/password/change';
import ScreenTitleText from '@/components/custom/text/screen-title';
import ModalScreenContainer from '@/components/custom/view/container/screen/modal';
import { useSignOut } from '@/hooks/auth/useSignOut';
import { AuthErrorCode } from '@/libs/error';
import { supabase } from '@/libs/supabase';

type PasswordResetScreenParams = {
  email: string;
  token: string;
};

export default function PasswordResetScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  const { email, token } = useLocalSearchParams<PasswordResetScreenParams>();

  const signOut = useSignOut();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return <CloseButton onPress={() => router.replace('/')} />;
      },
    });
  }, [navigation]);

  useLayoutEffect(() => {
    if (!email || !token) {
      router.replace('/');
    }

    if (session) return;

    (async () => {
      const {
        data: { session },
        error,
      } = await supabase.verifyOtp(email, token);
      if (session) setSession(session);
      if (error) {
        if (error.code === AuthErrorCode.OTP_EXPIRED) {
          Alert.alert('재설정 가능 시간이 만료되었습니다. 다시 시도해주세요.');
          router.replace('/');
          return;
        }
        console.error(error);
      }
    })();
  }, [email, session, token]);

  useEffect(() => {
    return () => {
      signOut();
    };
  }, [signOut]);

  const handleCompleted = useCallback(() => {
    router.navigate('/auth/signin');
  }, []);

  return (
    <ModalScreenContainer>
      {!session ? (
        <View style={styles.progressContainer}>
          <CircularProgress />
        </View>
      ) : (
        <View style={styles.container(bottom)}>
          <ScreenTitleText style={styles.title}>새로운 비밀번호를 입력해주세요</ScreenTitleText>
          <ChangePasswordForm isReset onCompleted={handleCompleted} />
        </View>
      )}
    </ModalScreenContainer>
  );
}

const stylesheet = createStyleSheet(theme => ({
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: (bottom: number) => ({
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: bottom + theme.spacing.xl,
  }),
  title: {
    marginBottom: theme.spacing.md,
  },
}));
