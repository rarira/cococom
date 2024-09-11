import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button, { ButtonProps } from '@/components/ui/button';
import Icon, { IconProps } from '@/components/ui/icon';
import Text, { TextProps } from '@/components/ui/text';

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  iconProps: IconProps;
  text?: string;
  textStyle?: TextProps['style'];
}

function IconButton({ style, text, iconProps, textStyle, ...restProps }: IconButtonProps) {
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
}

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

export default IconButton;
