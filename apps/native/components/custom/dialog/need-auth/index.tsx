import { useCallback } from 'react';

import Dialog, { DialogProps } from '@/components/ui/dialog';

import LoginButton from '../../button/login';

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
