import { memo } from 'react';
import { View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface CheckboxWrapperProps extends ViewProps {}

const CheckboxWrapper = memo(function Checkbox({ style, ...restProps }: CheckboxWrapperProps) {
  const { styles } = useStyles(stylesheet);

  return <View style={[styles.wrapper, style]} {...restProps} />;
});

const stylesheet = createStyleSheet(theme => ({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
}));

const Checkbox = {
  Root: CheckboxWrapper,
};

export default Checkbox;
