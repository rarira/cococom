import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text, { TextProps } from '@/components/ui/text';

interface SectionTextProps extends TextProps {
  isFirstSection?: boolean;
}

const SectionText = memo(function SectionText({
  isFirstSection,
  style,
  children,
  ...restProps
}: SectionTextProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Text style={[styles.container(isFirstSection), style]} {...restProps}>
      {children}
    </Text>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: (isFirstSection?: boolean) => ({
    fontWeight: 'bold',
    color: `${theme.colors.typography}80`,
    fontSize: theme.fontSize.normal,
    marginTop: isFirstSection ? 0 : theme.spacing.md,
    paddingVertical: theme.spacing.md,
  }),
}));

export default SectionText;
