import { memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CloseButton from '../close';

interface ModalCloseButtonProps {
  onPress: () => void;
  show?: boolean;
}

const ModalCloseButton = memo(function ModalCloseButton({ onPress, show }: ModalCloseButtonProps) {
  const { styles } = useStyles(stylesheet);

  if (!show) return null;

  return (
    <View style={styles.container}>
      <CloseButton onPress={onPress} />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    elevation: 25,
  },
}));

export default ModalCloseButton;
