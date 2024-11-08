import { forwardRef, memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button, { ButtonProps } from '@/components/core/button';
import Icon, { IconProps } from '@/components/core/icon';
import Text, { TextProps } from '@/components/core/text';

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  iconProps: IconProps;
  text?: string;
  textStyle?: TextProps['style'];
}

export default memo(
  forwardRef<typeof Button, IconButtonProps>(function IconButton(
    { style, text, iconProps, textStyle, ...restProps }: IconButtonProps,
    ref,
  ) {
    const { styles } = useStyles(stylesheet);

    return (
      <Button
        style={state => [styles.container, typeof style === 'function' ? style(state) : style]}
        {...restProps}
      >
        <Icon {...iconProps} />
        {/* <MaterialIcons color={theme.colors.typography} size={theme.fontSize.md} {...iconProps} /> */}
        {text && (
          <View style={styles.textContainer}>
            <Text type="defaultSemiBold" style={[styles.text, textStyle]}>
              {text}
            </Text>
          </View>
        )}
      </Button>
    );
  }),
);

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm / 2,
  },
  textContainer: {
    justifyContent: 'center',
  },
  text: {
    padding: 0,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
  },
}));
