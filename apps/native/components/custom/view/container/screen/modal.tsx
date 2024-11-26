import { StatusBar } from 'expo-status-bar';
import { memo } from 'react';

import Util from '@/libs/util';

interface ModalScreenContainerProps {
  children: React.ReactNode;
}

const ModalScreenContainer = memo(function ModalScreenContainer({
  children,
}: ModalScreenContainerProps) {
  return (
    <>
      <StatusBar style={Util.isPlatform('ios') ? 'light' : 'auto'} />
      {children}
    </>
  );
});

export default ModalScreenContainer;
