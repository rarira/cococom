import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { z } from 'zod';

import Button from '@/components/ui/button';
import Switch from '@/components/ui/switch';
import Text from '@/components/ui/text';
import TextInput from '@/components/ui/text-input';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

const formSchema = z
  .object({
    email: z
      .string()
      .email({
        message: '이메일 주소 형식을 확인해주세요',
      })
      .optional()
      .or(z.literal('')),
    nickname: z.string().min(2, { message: '닉네임은 최소 2자 이상으로 입력하세요' }).max(8),
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

const SignUpConfirmForm = memo(function SignUpConfirmForm() {
  const { styles } = useStyles(stylesheet);

  const { user, profile, setProfile, callbackAfterSignIn, setCallbackAfterSignIn } = useUserStore();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: profile?.email || '',
      nickname: profile?.nickname || '',
      email_opted_in: profile?.email_opted_in || true,
    },
    mode: 'onSubmit',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await supabase.updateProfile({ ...data, confirmed: true }, profile!.id);
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const newProfile = await updateProfileMutation.mutateAsync(values);
      setProfile(newProfile[0]);
      router.dismiss();

      if (callbackAfterSignIn) {
        callbackAfterSignIn(user!);
        setCallbackAfterSignIn(null);
      }
      Alert.alert('환영합니다! 가입이 완료되었습니다');
    },
    [callbackAfterSignIn, setCallbackAfterSignIn, setProfile, updateProfileMutation, user],
  );

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
          return (
            <TextInput.Root
              value={value}
              error={error?.message}
              label="닉네임"
              maxLength={8}
              style={styles.nicknameInput}
            >
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
      <Button onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>가입 완료</Text>
      </Button>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
  },
  nicknameInput: {
    marginTop: theme.spacing.md,
  },
  submitButton: {
    backgroundColor: theme.colors.tint,
    width: '100%',
    marginTop: theme.spacing.xl * 3,
    alignItems: 'center',
  },
  submitButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  switch: {
    marginTop: theme.spacing.sm,
  },
}));

export default SignUpConfirmForm;
