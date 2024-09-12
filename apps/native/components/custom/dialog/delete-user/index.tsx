import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button from '@/components/ui/button';
import Dialog, { DialogProps } from '@/components/ui/dialog';
import Text from '@/components/ui/text';
import { useDeleteUser } from '@/hooks/auth/useDeleteUser';

interface DeleteUserDialogProps extends Omit<DialogProps, 'title' | 'body'> {}

function DeleteUserDialog(props: DeleteUserDialogProps) {
  const { styles } = useStyles(stylesheet);

  const deleteUser = useDeleteUser();

  const renderButtons = useCallback(() => {
    return (
      <View style={styles.buttonContainer}>
        <Button
          onPress={async () => {
            await deleteUser();
            props.setVisible(false);
          }}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>탈퇴</Text>
        </Button>
        <Button onPress={() => props.setVisible(false)} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </Button>
      </View>
    );
  }, []);

  return (
    <Dialog
      type="alert"
      title="회원 탈퇴"
      body="정말로 탈퇴하시겠습니까? 탈퇴와 즉시 관련된 모든 데이터가 삭제되며 복구가 불가능합니다."
      renderButtons={renderButtons}
      {...props}
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

export default DeleteUserDialog;
