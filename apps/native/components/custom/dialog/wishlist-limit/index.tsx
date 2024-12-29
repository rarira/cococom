import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { router } from 'expo-router';

import Dialog, { DialogProps } from '@/components/core/dialog';
import Button from '@/components/core/button';
import Text from '@/components/core/text';

interface WishlistLimitDialogProps extends Omit<DialogProps, 'title' | 'body'> {
  limit: number;
}

function WishlistLimitDialog({ limit, setVisible, ...restProps }: WishlistLimitDialogProps) {
  const { styles } = useStyles(stylesheet);

  const renderButtons = useCallback(() => {
    return (
      <View style={styles.buttonContainer}>
        <Button onPress={() => setVisible(false)} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </Button>
        <Button
          onPress={() => {
            router.navigate('/my?tabs=wishlist');
            setVisible(false);
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>OK</Text>
        </Button>
      </View>
    );
  }, [
    setVisible,
    styles.button,
    styles.buttonContainer,
    styles.buttonText,
    styles.cancelButton,
    styles.cancelButtonText,
  ]);

  return (
    <Dialog
      title="관심상품 등록 개수 초과"
      body={`관심상품은 최대 ${limit}개까지 등록할 수 있습니다. 관심상품 목록에서 정리하시겠습니까?`}
      renderButtons={renderButtons}
      showCloseButton
      backdropDismiss
      setVisible={setVisible}
      {...restProps}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
  },
  button: {
    backgroundColor: theme.colors.tint,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    borderColor: theme.colors.typography,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: theme.colors.typography,
  },
}));

export default WishlistLimitDialog;
