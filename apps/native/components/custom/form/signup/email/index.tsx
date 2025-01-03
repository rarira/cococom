import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { z } from 'zod';

import Dialog from '@/components/core/dialog';
import TextInput from '@/components/core/text-input';
import FormSubmitButton from '@/components/custom/button/form/submit';
import TextInputEyeSlot from '@/components/custom/text-input/eye-slot';
import { PORTAL_HOST_NAMES } from '@/constants';
import { AuthErrorCode } from '@/libs/error';
import { signUpFormSchema } from '@/libs/form';
import { getProfile, supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';
import TermsView from '@/components/custom/view/terms';

const EmailSignUpForm = memo(function EmailSignUpForm() {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const { styles } = useStyles(stylesheet);
  const { setAuthProcessing, setProfile } = useUserStore(store => ({
    setAuthProcessing: store.setAuthProcessing,
    setProfile: store.setProfile,
  }));

  const { control, handleSubmit } = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit = useCallback(
    async ({ email, password }: z.infer<typeof signUpFormSchema>) => {
      if (!termsAgreed) {
        return Alert.alert(
          '약관 동의 필요',
          `이용약관 및 개인정보처리방침에 동의하셔야 이메일로 가입이 가능합니다.`,
        );
      }

      setAuthProcessing(true);
      setLoading(true);
      const {
        data: { session, user },
        error,
      } = await supabase.auth.signUpWithEmail({
        email: email,
        password: password,
        options: {
          data: {
            email,
            email_verified: true,
          },
        },
      });

      if (error) {
        console.error(error);

        if (error.code === AuthErrorCode.USER_ALERADY_EXISTS) {
          setShowDialog(true);
          return;
        } else {
          return Alert.alert(error.message);
        }
      }

      if (!session) {
        return Alert.alert('Please check your inbox for email verification!');
      }

      const profile = await getProfile(user!.id);
      setProfile(profile);
      setLoading(false);
      router.replace('/auth/signup/confirm');
    },
    [setAuthProcessing, setProfile, termsAgreed],
  );

  const renderButtons = useCallback(() => {
    return (
      <FormSubmitButton
        onPress={() => {
          setShowDialog(false);
        }}
        style={styles.submitButton}
        text="로그인하러 가기"
      />
    );
  }, [styles.submitButton]);

  const handleTermsAgreedChange = useCallback(({ isChecked }: { isChecked: boolean }) => {
    setTermsAgreed(isChecked);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
            return (
              <TextInput value={value} error={error?.message}>
                <TextInput.Field
                  placeholder="이메일 주소를 입력하세요"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                />
              </TextInput>
            );
          }}
          name="email"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <TextInput value={value} error={error?.message} style={styles.passwordInput}>
              <TextInput.Field
                placeholder="비밀번호를 입력하세요"
                onBlur={onBlur}
                onChangeText={onChange}
                textContentType="newPassword"
                secureTextEntry={!showPassword}
                passwordRules={
                  'minlength: 8; maxlength: 20; required: lower; required: upper; required: digit; required: special;'
                }
              />
              <TextInputEyeSlot show={showPassword} setShow={setShowPassword} />
            </TextInput>
          )}
          name="password"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <TextInput value={value} error={error?.message} style={styles.passwordInput}>
              <TextInput.Field
                placeholder="비밀번호를 다시 입력하세요"
                onBlur={onBlur}
                onChangeText={onChange}
                textContentType="password"
                secureTextEntry={!showConfirmPassword}
              />
              <TextInputEyeSlot show={showConfirmPassword} setShow={setShowConfirmPassword} />
            </TextInput>
          )}
          name="confirmPassword"
        />
        <FormSubmitButton
          text="이메일로 가입하기"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          style={styles.submitButton}
        />
        <TermsView termsAgreed={termsAgreed} handleTermsAgreedChange={handleTermsAgreedChange} />
      </View>
      <Dialog
        portalHostName={PORTAL_HOST_NAMES.SIGN_UP}
        onDismiss={() => router.replace('/auth/signin')}
        visible={showDialog}
        setVisible={setShowDialog}
        title="이미 가입된 이메일"
        body="가입시 사용한 방법으로 로그인해 주세요"
        renderButtons={renderButtons}
      />
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
  },
  passwordInput: {
    marginTop: theme.spacing.lg,
  },
  submitButton: {
    marginTop: theme.spacing.xl * 2,
  },
}));

export default EmailSignUpForm;
