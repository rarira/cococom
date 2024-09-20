import { zodResolver } from '@hookform/resolvers/zod';
import * as Linking from 'expo-linking';
import { memo, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { z } from 'zod';

import TextInput from '@/components/core/text-input';
import FormSubmitButton from '@/components/custom/button/form/submit';
import { lostPasswordFormSchema } from '@/libs/form';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

interface LostPasswordFormProps {
  onCompleted?: () => void;
}

const LostPasswordForm = memo(function LostPasswordForm({ onCompleted }: LostPasswordFormProps) {
  const { styles } = useStyles(stylesheet);

  const [loading, setLoading] = useState(false);

  const { setAuthProcessing } = useUserStore(store => ({
    setAuthProcessing: store.setAuthProcessing,
  }));

  const { control, handleSubmit } = useForm<z.infer<typeof lostPasswordFormSchema>>({
    resolver: zodResolver(lostPasswordFormSchema),
  });

  const onSubmit = useCallback(
    async ({ email }: z.infer<typeof lostPasswordFormSchema>) => {
      setAuthProcessing(true);
      setLoading(true);
      const resetPasswordURL = Linking.createURL('auth/password/reset');

      const { error } = await supabase.resetPassword(email, resetPasswordURL);

      if (error) {
        console.error(error);
      } else {
        Alert.alert(`${email}로 비밀번호 재설정 링크를 보냈습니다.`);
      }

      setLoading(false);
      setAuthProcessing(false);
      onCompleted?.();
    },
    [onCompleted, setAuthProcessing],
  );

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput.Root value={value} error={error?.message}>
            <TextInput.Field
              placeholder="이메일 주소를 입력하세요"
              onBlur={onBlur}
              onChangeText={onChange}
              textContentType="emailAddress"
              autoCapitalize="none"
            />
          </TextInput.Root>
        )}
        name="email"
      />
      <FormSubmitButton
        text="재설정 이메일 요청"
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
    marginTop: theme.spacing.lg,
  },
  submitButton: {
    marginTop: theme.spacing.xl * 2,
  },
}));

export default LostPasswordForm;
