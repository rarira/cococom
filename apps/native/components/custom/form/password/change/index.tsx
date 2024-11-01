import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { z } from 'zod';

import TextInput from '@/components/core/text-input';
import FormSubmitButton from '@/components/custom/button/form/submit';
import TextInputEyeSlot from '@/components/custom/text-input/eye-slot';
import { changePasswordFormSchema } from '@/libs/form';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

interface ChangePasswordFormProps {
  onCompleted?: () => void;
  isReset?: boolean;
}

const ChangePasswordForm = memo(function ChangePasswordForm({
  onCompleted,
  isReset,
}: ChangePasswordFormProps) {
  const { styles } = useStyles(stylesheet);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setAuthProcessing } = useUserStore(store => ({
    setAuthProcessing: store.setAuthProcessing,
  }));

  const { control, handleSubmit } = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const onSubmit = useCallback(
    async ({ password }: z.infer<typeof changePasswordFormSchema>) => {
      setAuthProcessing(true);
      setLoading(true);
      const { error } = await supabase.auth.changePassword(password);

      if (error) {
        console.error(error);
      } else {
        Alert.alert(
          isReset
            ? '비밀번호를 재설정하였습니다. 바뀐 비밀번호로 로그인해주세요.'
            : '비밀번호가 변경되었습니다.',
        );
      }

      setLoading(false);
      setAuthProcessing(false);
      onCompleted?.();
    },
    [isReset, onCompleted, setAuthProcessing],
  );

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput.Root value={value} error={error?.message}>
            <TextInput.Field
              placeholder="비밀번호를 입력하세요"
              onBlur={onBlur}
              onChangeText={onChange}
              textContentType="password"
              secureTextEntry={!showPassword}
              passwordRules={
                'minlength: 8; maxlength: 20; required: lower; required: upper; required: digit; required: special;'
              }
            />
            <TextInputEyeSlot show={showPassword} setShow={setShowPassword} disabled={loading} />
          </TextInput.Root>
        )}
        name="password"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput.Root value={value} error={error?.message} style={styles.passwordInput}>
            <TextInput.Field
              placeholder="비밀번호를 다시 입력하세요"
              onBlur={onBlur}
              onChangeText={onChange}
              textContentType="password"
              secureTextEntry={!showConfirmPassword}
            />
            <TextInputEyeSlot
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              disabled={loading}
            />
          </TextInput.Root>
        )}
        name="confirmPassword"
      />
      <FormSubmitButton
        text={isReset ? '비밀번호 재설정' : '비밀번호 변경'}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        style={styles.submitButton}
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
    marginTop: theme.spacing.xl * 2,
  },
  textInputSlot: {
    paddingRight: theme.spacing.sm,
  },
}));

export default ChangePasswordForm;
