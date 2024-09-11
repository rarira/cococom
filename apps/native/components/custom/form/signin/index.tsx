import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Dispatch, memo, SetStateAction, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { z } from 'zod';

import TextInput from '@/components/ui/text-input';
import { signInFormSchema } from '@/libs/form';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

import FormSubmitButton from '../../button/form/submit';

interface SignInFormProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const SignInForm = memo(function SignInForm({ loading, setLoading }: SignInFormProps) {
  const { styles } = useStyles(stylesheet);
  const { setUser, callbackAfterSignIn, setCallbackAfterSignIn } = useUserStore();

  const { control, handleSubmit } = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
  });

  const onSubmit = useCallback(
    async ({ email, password }: z.infer<typeof signInFormSchema>) => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.signInWithEmail({ email, password });

      if (error) Alert.alert(error.message);
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
    [callbackAfterSignIn, setCallbackAfterSignIn, setLoading, setUser],
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
              placeholder="패스워드를 입력하세요"
              onBlur={onBlur}
              onChangeText={onChange}
              textContentType="password"
              secureTextEntry
            />
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
}));

export default SignInForm;
