import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button, { ButtonProps } from '@/components/ui/button';
import Text from '@/components/ui/text';

interface LoginButtonProps extends Pick<ButtonProps, 'style'> {}

const LoginButton = memo(function LoginButton({ style }: LoginButtonProps) {
  const { styles } = useStyles(stylesheet);

  const handlePress = useCallback(() => {
    router.push('/auth/signin');
  }, []);

  console.log('LoginButton render');
  return (
    <Button
      onPress={handlePress}
      style={state => [styles.container, typeof style === 'function' ? style(state) : style]}
    >
      <Text style={styles.text}>로그인</Text>
    </Button>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    backgroundColor: theme.colors.tint,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
}));

export default LoginButton;
