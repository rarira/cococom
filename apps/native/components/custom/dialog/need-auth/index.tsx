import { router } from 'expo-router';
import { useCallback } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button from '@/components/ui/button';
import Dialog, { DialogProps } from '@/components/ui/dialog';
import Text from '@/components/ui/text';

interface NeedAuthDialogProps extends Omit<DialogProps, 'title'> {
  body: string;
}

function NeedAuthDialog(props: NeedAuthDialogProps) {
  const { styles } = useStyles(stylesheet);

  const renderButtons = useCallback(() => {
    return (
      <Button onPress={() => router.push('/auth/signin')} style={styles.loginButton}>
        <Text style={styles.loginText}>로그인</Text>
      </Button>
    );
  }, [styles.loginButton, styles.loginText]);

  return (
    <Dialog
      title="로그인 필요"
      renderButtons={renderButtons}
      showCloseButton
      backdropDismiss
      {...props}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  loginButton: {
    backgroundColor: theme.colors.link,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: theme.colors.tint3,
    fontWeight: 'bold',
  },
}));

export default NeedAuthDialog;
