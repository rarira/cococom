import { memo } from 'react';

import StatusBar from '@/components/custom/status-bar';

interface ModalScreenContainerProps {
  children: React.ReactNode;
}

const ModalScreenContainer = memo(function ModalScreenContainer({
  children,
}: ModalScreenContainerProps) {
  return (
    <>
      <StatusBar style="light" />
      {children}
    </>
  );
});

export default ModalScreenContainer;
