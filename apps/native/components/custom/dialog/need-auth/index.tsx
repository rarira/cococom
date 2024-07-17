import { Dispatch, SetStateAction } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Dialog from '@/components/ui/dialog';
import { PortalHostNames } from '@/constants';

interface NeedAuthDialogProps {
  portalHostName: PortalHostNames;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

function NeedAuthDialog(props: NeedAuthDialogProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Dialog
      {...props}
      title="로그인 필요"
      body="관심 상품 등록을 하시면 편리하게 쇼핑하실 수 있습니다. 로그인이 필요합니다"
      // showCloseButton
      // backdropDismiss
    />
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
