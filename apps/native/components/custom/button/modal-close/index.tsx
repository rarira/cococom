import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button from '@/components/ui/button';

interface ModalCloseButtonProps {
  onPress: () => void;
  show?: boolean;
}

const ModalCloseButton = memo(function ModalCloseButton({ onPress, show }: ModalCloseButtonProps) {
  const { styles, theme } = useStyles(stylesheet);

  if (!show) return null;

  return (
    <View style={styles.container}>
      <Button onPress={onPress}>
        <MaterialIcons name="close" size={theme.fontSize.lg} color={theme.colors.typography} />
      </Button>
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
