import { memo } from 'react';
import { View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

type DividerOrientation = 'horizontal' | 'vertical';

interface DividerProps extends ViewProps {
  orientation?: DividerOrientation;
}

const Divider = memo(function Divider({
  style,
  orientation = 'horizontal',
  ...restProps
}: DividerProps) {
  const { styles } = useStyles(stylesheet);

  return <View style={[styles.container(orientation), style]} />;
});

const stylesheet = createStyleSheet(theme => ({
  container: (orientation: DividerOrientation) => ({
    backgroundColor: theme.colors.typography,
    opacity: 0.5,
    ...(orientation === 'horizontal'
      ? {
          height: 1,
          width: '100%',
          marginVertical: theme.spacing.md,
        }
      : {
          height: '100%',
          width: 1,
          marginHorizontal: theme.spacing.md,
        }),
  }),
}));

export default Divider;
