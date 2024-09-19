import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text, { TextProps } from '@/components/ui/text';

interface SectionTextProps extends TextProps {}

const SectionText = memo(function SectionText({ style, children, ...restProps }: SectionTextProps) {
  const { styles } = useStyles(stylesheet);

  console.log('SectionText', { style, children, restProps });
  return (
    <Text style={[styles.container, style]} {...restProps}>
      {children}
    </Text>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    fontWeight: 'bold',
    color: `${theme.colors.typography}80`,
    fontSize: theme.fontSize.normal,
    marginVertical: theme.spacing.md,
  },
}));

export default SectionText;
