import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/core/button/icon';

interface HeaderRightButtonProps extends IconButtonProps {
  iconProps: Omit<IconButtonProps['iconProps'], 'size' | 'color'>;
}

const HeaderRightButton = memo(function HeaderRightButton({
  style,
  iconProps,
  ...restProps
}: HeaderRightButtonProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <IconButton
      iconProps={{
        size: theme.fontSize.lg,
        color: theme.colors.typography,
        ...iconProps,
      }}
      style={({ pressed }) => [
        styles.container(pressed),
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...restProps}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: (pressed: boolean) => ({
    opacity: pressed ? 0.5 : 1,
    marginLeft: theme.spacing.md,
  }),
}));

export default HeaderRightButton;
