import { router } from 'expo-router';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button from '@/components/ui/button';
import Dialog from '@/components/ui/dialog';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';

interface NeedAuthDialogProps {
  portalHostName: PortalHostNames;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
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
      {...props}
      title="로그인 필요"
      body="관심 상품 등록을 하시면 편리하게 쇼핑하실 수 있습니다. 로그인이 필요합니다"
      renderButtons={renderButtons}
      showCloseButton
      backdropDismiss
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
