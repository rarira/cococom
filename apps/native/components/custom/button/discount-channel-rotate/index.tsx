import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button, { ButtonProps } from '@/components/core/button';
import Text from '@/components/core/text';
import { DiscountChannels } from '@/constants';
import { RotateButtonOption } from '@/hooks/discount/useDiscountRotateButton';

interface DiscountChannelRotateButtonProps extends ButtonProps {
  channelOption: RotateButtonOption<DiscountChannels>;
}

const DiscountChannelRotateButton = memo(function DiscountChannelRotateButton({
  onPress,
  channelOption,
  ...restProps
}: DiscountChannelRotateButtonProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Button onPress={onPress} hitSlop={theme.spacing.md} style={styles.rotateButton} {...restProps}>
      <Text style={styles.rotateButtonText}>{channelOption.text}</Text>
    </Button>
  );
});

const stylesheet = createStyleSheet(theme => ({
  rotateButton: {
    borderColor: theme.colors.typography,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateButtonText: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.typography,
  },
}));

export default DiscountChannelRotateButton;
