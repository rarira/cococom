import { StatusBar } from 'expo-status-bar';
import { memo } from 'react';

interface ModalScreenContainerProps {
  children: React.ReactNode;
}

const ModalScreenContainer = memo(function ModalScreenContainer({
  children,
}: ModalScreenContainerProps) {
  return (
    <>
      <StatusBar />
      {children}
    </>
  );
});

export default ModalScreenContainer;
