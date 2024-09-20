import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/core/button/icon';

interface HeaderBackButtonProps extends Omit<IconButtonProps, 'iconProps'> {
  // iconProps: Omit<IconButtonProps['iconProps'], 'size' | 'color' | 'font'>;
}

const HeaderBackButton = memo(function HeaderBackButton({
  style,
  text,
  textStyle,
  // iconProps,
  ...restProps
}: HeaderBackButtonProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <IconButton
      iconProps={{
        font: { type: 'MaterialIcon', name: 'arrow-back-ios' },
        size: theme.fontSize.xl,
        color: theme.colors.typography,
      }}
      style={({ pressed }) => [
        styles.container(pressed),
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      text={text}
      textStyle={[styles.text, textStyle]}
      {...restProps}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: (pressed: boolean) => ({
    opacity: pressed ? 0.5 : 1,
    gap: 0,
  }),
  text: {
    fontSize: theme.fontSize.md,
    color: theme.colors.typography,
  },
}));

export default HeaderBackButton;
