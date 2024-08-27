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
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput.Root>
            <TextInput.Field
              placeholder="이메일"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={!profile?.email_verified}
            />
          </TextInput.Root>
        )}
        name="email"
        disabled={!!profile?.email_verified}
      />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {},
}));

export default SignUpConfirmForm;
