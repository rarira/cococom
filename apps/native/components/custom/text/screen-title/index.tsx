import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text, { TextProps } from '@/components/core/text';

interface ScreenTitleTextProps extends TextProps {}

const ScreenTitleText = memo(function ScreenTitleText({
  style,
  ...restProps
}: ScreenTitleTextProps) {
  const { styles } = useStyles(stylesheet);

  return <Text style={[styles.title, style]} {...restProps} />;
});

const stylesheet = createStyleSheet(theme => ({
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
  },
}));

export default ScreenTitleText;
