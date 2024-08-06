import { memo } from 'react';
import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export type TextProps = NativeTextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

const Text = memo(function Text({ style, type = 'default', ...rest }: TextProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <NativeText
      style={[
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
});

const stylesheet = createStyleSheet(theme => {
  const commonStyles = {
    color: theme.colors.typography,
    fontSize: theme.fontSize.md,
    fontWeight: 'normal' as const,
    lineHeight: theme.fontSize.md * 1.5,
  };

  return {
    default: {
      ...commonStyles,
    },
    defaultSemiBold: {
      ...commonStyles,
      lineHeight: 24,
      fontWeight: '600',
    },
    title: {
      ...commonStyles,
      fontSize: theme.fontSize.xl,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    subtitle: {
      ...commonStyles,
      fontSize: theme.fontSize.lg,
      lineHeight: theme.fontSize.lg * 1.5,
      fontWeight: 'bold',
    },
    link: {
      ...commonStyles,
      lineHeight: 30,
      color: theme.colors.link,
    },
  };
});

export default Text;
