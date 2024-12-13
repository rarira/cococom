import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/core/button/icon';

interface HeaderRightButtonProps extends IconButtonProps {
  iconProps: Omit<IconButtonProps['iconProps'], 'size' | 'color'>;
}

const HeaderRightButton = memo(function HeaderRightButton({
  style,
  iconProps,
  onPress,
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
      style={prop => [
        styles.container(prop.pressed),
        typeof style === 'function' ? style(prop) : style,
      ]}
      //TODO: https://github.com/software-mansion/react-native-screens/issues/2219#issuecomment-2481628312
      onPressOut={onPress}
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
