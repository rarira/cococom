import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';

const ResetPasswordButton = memo(function ResetPasswordButton() {
  const { styles } = useStyles(stylesheet);

  return (
    <Link href={'/auth/password/lost'} asChild>
      <Pressable style={styles.container}>
        <Text style={styles.text}>비밀번호 재설정</Text>
      </Pressable>
    </Link>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: { width: '100%', alignItems: 'center', marginTop: theme.spacing.md },
  text: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.tint3,
    fontWeight: 'semibold',
    textDecorationLine: 'underline',
  },
}));

export default ResetPasswordButton;
