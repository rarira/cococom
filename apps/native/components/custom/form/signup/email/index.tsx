import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { z } from 'zod';

import FormSubmitButton from '@/components/custom/button/form/submit';
import Dialog from '@/components/ui/dialog';
import TextInput from '@/components/ui/text-input';
import { PortalHostNames } from '@/constants';
import { ErrorCode } from '@/libs/error';
import { signUpFormSchema } from '@/libs/form';
import { getProfile, supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

const EmailSignUpForm = memo(function EmailSignUpForm() {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
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
      setAuthProcessing(true);
      setLoading(true);
      const {
        data: { session, user },
        error,
      } = await supabase.signUpWithEmail({
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

        if (error.code === ErrorCode.USER_ALERADY_EXISTS) {
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
    [setAuthProcessing, setProfile],
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

  return (
    <>
      <View style={styles.container}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
            return (
              <TextInput.Root value={value} error={error?.message}>
                <TextInput.Field
                  placeholder="이메일 주소를 입력하세요"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                />
              </TextInput.Root>
            );
          }}
          name="email"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <TextInput.Root value={value} error={error?.message} style={styles.passwordInput}>
              <TextInput.Field
                placeholder="패스워드를 입력하세요"
                onBlur={onBlur}
                onChangeText={onChange}
                textContentType="password"
                secureTextEntry
                passwordRules={
                  'minlength: 8; maxlength: 20; required: lower; required: upper; required: digit; required: special;'
                }
              />
            </TextInput.Root>
          )}
          name="password"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <TextInput.Root value={value} error={error?.message} style={styles.passwordInput}>
              <TextInput.Field
                placeholder="패스워드를 다시 입력하세요"
                onBlur={onBlur}
                onChangeText={onChange}
                textContentType="password"
                secureTextEntry
              />
            </TextInput.Root>
          )}
          name="confirmPassword"
        />
        <FormSubmitButton
          text="이메일로 가입하기"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          style={styles.submitButton}
        />
      </View>
      <Dialog
        portalHostName={PortalHostNames.SIGN_UP}
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