import { useCallback } from 'react';

import LoginButton from '@/components/custom/button/login';
import Dialog, { DialogProps } from '@/components/ui/dialog';

interface NeedAuthDialogProps extends Omit<DialogProps, 'title'> {
  body: string;
}

function NeedAuthDialog(props: NeedAuthDialogProps) {
  const renderButtons = useCallback(() => {
    return <LoginButton />;
  }, []);

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

export default NeedAuthDialog;
