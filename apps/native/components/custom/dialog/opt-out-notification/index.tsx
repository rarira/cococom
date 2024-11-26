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
        <Button onPress={onPressOk} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>탈퇴</Text>
        </Button>
        <Button onPress={() => setVisible(false)} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </Button>
      </View>
    );
  }, [
    onPressOk,
    setVisible,
    styles.buttonContainer,
    styles.cancelButton,
    styles.cancelButtonText,
    styles.deleteButton,
    styles.deleteButtonText,
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
  deleteButton: {
    borderColor: theme.colors.alert,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  deleteButtonText: {
    color: theme.colors.alert,
  },
  cancelButton: {
    backgroundColor: theme.colors.tint,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
}));

export default memo(OptOutNotificationDialog);
