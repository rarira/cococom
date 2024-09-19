import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { z } from 'zod';

import FormSubmitButton from '@/components/custom/button/form/submit';
import Switch from '@/components/ui/switch';
import TextInput from '@/components/ui/text-input';
import useSession from '@/hooks/useSession';
import { supabase } from '@/libs/supabase';
import Util from '@/libs/util';
import { useUserStore } from '@/store/user';

interface SignUpConfirmFormProps extends ViewProps {
  update?: boolean;
}

const formSchema = z
  .object({
    email: z
      .string()
      .email({
        message: '이메일 주소 형식을 확인해주세요',
      })
      .optional()
      .or(z.literal('')),
    nickname: z
      .string()
      .min(2, { message: '닉네임은 최소 2자 이상으로 입력하세요' })
      .max(8, { message: '닉네임은 최대 8자까지 입력 가능합니다' }),
    email_opted_in: z.boolean(),
  })
  .refine(
    data => {
      if (data.email_opted_in) {
        return !!data.email;
      }
      return true;
    },
    {
      message: '이메일 주소를 입력해주세요',
      path: ['email'],
    },
  );

const SignUpConfirmForm = memo(function SignUpConfirmForm({
  update,
  style,
  ...restProps
}: SignUpConfirmFormProps) {
  const [loading, setLoading] = useState(false);
  const { styles } = useStyles(stylesheet);

  const session = useSession();

  const {
    profile,
    setProfile,
    setUser,
    callbackAfterSignIn,
    setCallbackAfterSignIn,
    setAuthProcessing,
  } = useUserStore();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: profile?.email || '',
      nickname: profile?.nickname || '',
      email_opted_in: profile?.email_opted_in ?? true,
    },
    mode: 'onSubmit',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await supabase.updateProfile(
        { ...Util.trimObject(data), confirmed: true },
        profile!.id,
      );
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      const newProfile = await updateProfileMutation.mutateAsync(values);
      setProfile(newProfile[0]);
      !update && setUser(session!.user);
      router.dismiss();

      if (callbackAfterSignIn && !update) {
        callbackAfterSignIn(session!.user);
        setCallbackAfterSignIn(null);
      }
      setAuthProcessing(false);
      Alert.alert(update ? '프로필 변경이 완료되었습니다' : '환영합니다! 가입이 완료되었습니다');
      setLoading(false);
    },
    [
      callbackAfterSignIn,
      session,
      setAuthProcessing,
      setCallbackAfterSignIn,
      setProfile,
      setUser,
      update,
      updateProfileMutation,
    ],
  );

  return (
    <View style={[styles.container, style]} {...restProps}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
          return (
            <TextInput.Root value={value} error={error?.message} label="닉네임" maxLength={8}>
              <TextInput.Field
                placeholder="2 ~ 8 자로 입력하세요"
                onBlur={onBlur}
                onChangeText={onChange}
              />
            </TextInput.Root>
          );
        }}
        name="nickname"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput.Root
            editable={!profile?.email_verified}
            value={value}
            error={error?.message}
            label="이메일"
          >
            <TextInput.Field
              placeholder="이메일 주소를 입력하세요"
              onBlur={onBlur}
              onChangeText={onChange}
            />
          </TextInput.Root>
        )}
        name="email"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Switch
            checked={value}
            onChange={onChange}
            labelProps={{ children: '알림 메일 수신을 동의합니다' }}
            style={styles.switch}
          />
        )}
        name="email_opted_in"
      />
      <FormSubmitButton
        text={update ? '업데이트' : '가입 완료'}
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
        disabled={loading}
      />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
  },
  switch: {
    marginTop: theme.spacing.sm,
  },
  submitButton: {
    marginTop: theme.spacing.xl * 2,
  },
}));

export default SignUpConfirmForm;
