import { memo } from 'react';
import { useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/ui/button/icon';

interface CloseButtonProps extends Partial<Omit<IconButtonProps, 'text' | 'textStyle'>> {}

const CloseButton = memo(function CloseButton({ iconProps, ...restProps }: CloseButtonProps) {
  const { theme } = useStyles();

  return (
    <IconButton
      iconProps={{
        ...{
          font: { type: 'MaterialIcon', name: 'close' },
          size: theme.fontSize.lg,
          color: theme.colors.typography,
        },
        ...iconProps,
      }}
      {...restProps}
    />
  );
});

export default CloseButton;
