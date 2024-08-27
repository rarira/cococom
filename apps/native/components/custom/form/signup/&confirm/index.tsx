import { memo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TextInput from '@/components/ui/text-input';
import { useUserStore } from '@/store/user';

interface SignUpConfirmFormProps {}

const SignUpConfirmForm = memo(function SignUpConfirmForm({}: SignUpConfirmFormProps) {
  const { styles } = useStyles(stylesheet);

  const { profile, setProfile } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: profile?.email || '',
      picture: profile?.picture || '',
      nickname: profile?.nickname || '',
    },
  });

  console.log('SignUpConfirmForm', profile, !!profile?.email_verified);
  return (
    <View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput.Root editable={!profile?.email_verified} value={value} error={error?.message}>
            <TextInput.Field placeholder="이메일" onBlur={onBlur} onChangeText={onChange} />
          </TextInput.Root>
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{ required: '닉네임을 입력해주세요' }}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <TextInput.Root value={value} error={error?.message}>
            <TextInput.Field placeholder="닉네임" onBlur={onBlur} onChangeText={onChange} />
          </TextInput.Root>
        )}
        name="nickname"
      />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {},
}));

export default SignUpConfirmForm;
