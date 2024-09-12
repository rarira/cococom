import { Portal } from '@gorhom/portal';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { Modal, ModalProps, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ModalCloseButton from '@/components/custom/button/modal-close';
import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';

import Icon from '../icon';

export interface DialogProps extends ModalProps {
  portalHostName: PortalHostNames;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  backdropDismiss?: boolean;
  showCloseButton?: boolean;
  title: string;
  body: string;
  dismissButtonText?: string;
  renderButtons?: () => JSX.Element;
  type?: 'alert' | 'normal';
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
  type = 'normal',
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
            <View style={styles.titleContainer}>
              {type === 'alert' && (
                <Icon
                  font={{ type: 'Ionicon', name: 'alert-circle' }}
                  color={theme.colors.alert}
                  size={theme.fontSize.xxl}
                />
              )}
              <Text
                type="title"
                style={styles.titleText(type === 'alert' ? theme.colors.alert : undefined)}
              >
                {title}
              </Text>
            </View>
            <Text style={styles.bodyText}>{body}</Text>
            {!!renderButtons && <View style={styles.modalButtonGroup}>{renderButtons()}</View>}
            <ModalCloseButton onPress={handleDismiss} show={needToShowCloseButton} />
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  titleText: (color?: string) => ({
    color: color || theme.colors.tint,
  }),
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
}));

export default Dialog;
