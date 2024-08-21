import { Pressable, PressableProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export interface ButtonProps extends PressableProps {}

function Button({ style, disabled, ...restProps }: ButtonProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      style={state => [
        styles.container(state.pressed, disabled),
        typeof style === 'function' ? style(state) : style,
      ]}
      hitSlop={10}
      disabled={disabled}
      {...restProps}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (pressed: boolean, disabled?: null | boolean) => ({
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    opacity: pressed ? 0.5 : disabled ? 0.3 : 1,
  }),
}));

export default Button;
