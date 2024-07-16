import { Portal } from '@gorhom/portal';
import { Button, Modal, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';

interface NeedAuthDialogProps {
  portalHostName: PortalHostNames;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

function NeedAuthDialog({ portalHostName, visible, setVisible }: NeedAuthDialogProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Portal hostName={portalHostName}>
      <Modal visible={visible} animationType="fade" transparent={true}>
        <View style={styles.modalView}>
          <View style={styles.alert}>
            <Text style={styles.alertTitle}>Attention!</Text>
            <Text style={styles.alertMessage}>Your account has been activated.</Text>
            <View style={styles.alertButtonGroup}>
              <View style={styles.alertButton}>
                <Button title="OK" onPress={() => setVisible(false)} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const stylesheet = createStyleSheet(theme => ({
  modalView: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  alert: {
    width: '100%',
    maxWidth: 300,
    margin: 48,
    elevation: 24,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  alertTitle: {
    margin: 24,
    fontWeight: 'bold',
    fontSize: 24,
    color: '#000',
  },
  alertMessage: {
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 24,
    fontSize: 16,
    color: '#000',
  },
  alertButtonGroup: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 8,
    marginLeft: 24,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  alertButton: {
    marginTop: 12,
    marginRight: 8,
    width: 100,
  },
}));

export default NeedAuthDialog;
