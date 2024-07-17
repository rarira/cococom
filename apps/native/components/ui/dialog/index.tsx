import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Portal } from '@gorhom/portal';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { Modal, ModalProps, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';

interface DialogProps extends ModalProps {
  portalHostName: PortalHostNames;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  backdropDismiss?: boolean;
  showCloseButton?: boolean;
  title: string;
  body: string;
  dismissButtonText?: string;
  renderButtons?: () => JSX.Element;
}

function Dialog({
  portalHostName,
  visible,
  setVisible,
  backdropDismiss,
  showCloseButton,
  title,
  body,
  dismissButtonText = 'OK',
  renderButtons,
  ...restProps
}: DialogProps) {
  const { styles, theme } = useStyles(stylesheet);

  const handleDismiss = useCallback(() => setVisible(false), [setVisible]);

  const needToShowCloseButton = showCloseButton || !(renderButtons || backdropDismiss);

  return (
    <Portal hostName={portalHostName}>
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        hardwareAccelerated
        onRequestClose={handleDismiss}
        {...restProps}
      >
        <View style={styles.scrim}>
          {backdropDismiss && <Button onPress={handleDismiss} style={styles.backdropButton} />}
          <View style={styles.modal}>
            <Text type="subtitle" style={styles.titleText}>
              {title}
            </Text>
            <Text style={styles.bodyText}>{body}</Text>
            {!!renderButtons && <View style={styles.modalButtonGroup}>{renderButtons()}</View>}
            {needToShowCloseButton && (
              <View style={styles.closeButtonContainer}>
                <Button onPress={handleDismiss}>
                  <MaterialIcons
                    name="close"
                    size={theme.fontSize.lg}
                    color={theme.colors.typography}
                  />
                </Button>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const stylesheet = createStyleSheet(theme => ({
  scrim: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.scrim,
  },
  backdropButton: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: 300,
    margin: 'auto',
    elevation: 24,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg * 2,
  },
  titleText: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.tint,
  },
  bodyText: {
    marginBottom: theme.spacing.xl,
  },
  modalButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  dismissButtonText: {
    color: theme.colors.link,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    elevation: 25,
  },
}));

export default Dialog;
