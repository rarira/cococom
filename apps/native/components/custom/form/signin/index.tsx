import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { z } from 'zod';

import TextInput from '@/components/core/text-input';
import FormSubmitButton from '@/components/custom/button/form/submit';
import TextInputEyeSlot from '@/components/custom/text-input/eye-slot';
import { AuthErrorCode } from '@/libs/error';
import { signInFormSchema } from '@/libs/form';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

interface SignInFormProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const SignInForm = memo(function SignInForm({ loading, setLoading }: SignInFormProps) {
  const { styles } = useStyles(stylesheet);
  const { setUser, callbackAfterSignIn, setCallbackAfterSignIn } = useUserStore();

  const { control, handleSubmit, reset } = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = useCallback(
    async ({ email, password }: z.infer<typeof signInFormSchema>) => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithEmail({ email, password });

      if (error) {
        if (error.code === AuthErrorCode.INVALID_CREDENTIALS) {
          Alert.alert(
            '사용자가 존재하지 않습니다. 다른 로그인 방법을 시도하시거나 회원가입해 주세요',
          );
          reset();
          setShowPassword(false);
          setLoading(false);
          return;
        }
        console.error('email sign in error', error);
      }
      if (user) {
        setUser(user);
        if (callbackAfterSignIn) {
          callbackAfterSignIn(user);
          setCallbackAfterSignIn(null);
        }
      }

      setLoading(false);
      router.dismiss();
    },
    [callbackAfterSignIn, reset, setCallbackAfterSignIn, setLoading, setUser],
  );

  return (
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
              placeholder="비밀번호를 입력하세요"
              onBlur={onBlur}
              onChangeText={onChange}
              textContentType="password"
              secureTextEntry={!showPassword}
            />
            <TextInputEyeSlot show={showPassword} setShow={setShowPassword} disabled={loading} />
          </TextInput.Root>
        )}
        name="password"
      />
      <FormSubmitButton
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
        disabled={loading}
        text="이메일로 로그인"
      />
    </View>
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
    marginTop: theme.spacing.xl,
  },
  textInputSlot: {
    paddingRight: theme.spacing.sm,
  },
}));

export default SignInForm;
