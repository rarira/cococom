import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/core/button/icon';
import { IconProps } from '@/components/core/icon';

interface SortWithTextButtonProps extends Omit<IconButtonProps, 'iconProps'> {
  iconProps?: Omit<IconProps, 'font'>;
}

const SortWithTextButton = memo(function SortWithTextButton({
  text,
  onPress,
  style,
  textStyle,
  iconProps,
  ...restProps
}: SortWithTextButtonProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <IconButton
      iconProps={{
        font: { type: 'MaterialIcon', name: 'sort' },
        color: theme.colors.typography,
        size: theme.fontSize.lg,
        ...iconProps,
      }}
      text={text}
      onPress={onPress}
      style={state => [styles.button, typeof style === 'function' ? style(state) : style]}
      textStyle={[styles.buttonText, textStyle]}
      {...restProps}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  button: {
    alignSelf: 'flex-end',
  },
  buttonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.typography,
  },
}));

export default SortWithTextButton;
