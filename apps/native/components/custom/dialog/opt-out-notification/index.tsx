import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button from '@/components/core/button';
import Dialog, { DialogProps } from '@/components/core/dialog';
import Text from '@/components/core/text';

interface OptOutNotificationProps extends DialogProps {
  onPressOk: () => void;
}

function OptOutNotificationDialog({
  title,
  body,
  visible,
  setVisible,
  onPressOk,
  ...restProps
}: OptOutNotificationProps) {
  const { styles } = useStyles(stylesheet);

  const renderButtons = useCallback(() => {
    return (
      <View style={styles.buttonContainer}>
        <Button onPress={() => setVisible(false)} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </Button>
        <Button onPress={onPressOk} style={styles.okButton}>
          <Text style={styles.okButtonText}>OK</Text>
        </Button>
      </View>
    );
  }, [
    styles.buttonContainer,
    styles.cancelButton,
    styles.cancelButtonText,
    styles.okButton,
    styles.okButtonText,
    onPressOk,
    setVisible,
  ]);

  return (
    <Dialog
      visible={visible}
      setVisible={setVisible}
      type="alert"
      title={title}
      body={body}
      renderButtons={renderButtons}
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
  okButton: {
    backgroundColor: theme.colors.tint,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  okButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
}));

export default memo(OptOutNotificationDialog);
