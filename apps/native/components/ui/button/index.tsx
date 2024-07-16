import { Pressable, PressableProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export interface ButtonProps extends PressableProps {}

function Button({ style, ...restProps }: ButtonProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      style={state => [
        styles.container(state.pressed),
        typeof style === 'function' ? style(state) : style,
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      {...restProps}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (pressed: boolean) => ({
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    opacity: pressed ? 0.5 : 1,
  }),
}));

export default Button;
