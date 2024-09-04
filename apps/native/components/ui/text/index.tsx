import { forwardRef, memo } from 'react';
import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export type TextProps = NativeTextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

const Text = memo(
  forwardRef(function Text({ style, type = 'default', ...rest }: TextProps, ref) {
    const { styles } = useStyles(stylesheet);

    return (
      <NativeText
        ref={ref as any}
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
  }),
);

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
      fontSize: theme.fontSize.lg,
      fontWeight: 'bold',
      lineHeight: theme.fontSize.lg * 1.5,
    },
    subtitle: {
      ...commonStyles,
      fontSize: theme.fontSize.md,
      lineHeight: theme.fontSize.md * 1.5,
      fontWeight: 'semibold',
    },
    link: {
      ...commonStyles,
      lineHeight: 30,
      color: theme.colors.link,
    },
  };
});

export default Text;
