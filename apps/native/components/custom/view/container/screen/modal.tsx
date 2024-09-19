import { StatusBar } from 'expo-status-bar';
import { memo } from 'react';
import { Platform } from 'react-native';

interface ModalScreenContainerProps {
  children: React.ReactNode;
}

const ModalScreenContainer = memo(function ModalScreenContainer({
  children,
}: ModalScreenContainerProps) {
  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      {children}
    </>
  );
});

export default ModalScreenContainer;
