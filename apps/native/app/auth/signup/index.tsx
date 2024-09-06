import { PortalHost } from '@gorhom/portal';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useLayoutEffect } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import EmailSignUpForm from '@/components/custom/form/signup/email';
import ScreenTitleText from '@/components/custom/text/screen-title';
import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';

export default function SignUpScreen() {
  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  const { from } = useLocalSearchParams<{ from: string }>();

  console.log('sign up screen', { from });
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        // TODO: 디자인 정교화 필요
        return from === 'signin' ? (
          <Button onPress={() => router.replace('/auth/signin')}>
            <Text>로그인</Text>
          </Button>
        ) : null;
      },
    });
  }, [from, navigation]);

  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
    paddingTop: theme.spacing.lg,
    paddingBottom: bottomInset + theme.spacing.lg,
    backgroundColor: theme.colors.background,
  }),
}));
