import { IconProps } from '@expo/vector-icons/build/createIconSet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Platform, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button, { ButtonProps } from '@/components/ui/button';
import Text, { TextProps } from '@/components/ui/text';

export interface IconButtonProps<T = keyof typeof MaterialIcons.glyphMap>
  extends Omit<ButtonProps, 'children'> {
  iconProps: IconProps<T>;
  text?: string;
  textStyle?: TextProps['style'];
}

function IconButton({ style, text, iconProps, textStyle, ...restProps }: IconButtonProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Button
      style={state => [styles.container, typeof style === 'function' ? style(state) : style]}
      {...restProps}
    >
      <MaterialIcons color={theme.colors.typography} size={theme.fontSize.md} {...iconProps} />
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
    ...(Platform.OS === 'ios' ? { paddingTop: (theme.fontSize.sm * 0.5) / 2 } : {}), // Adjust padding on iOS
  },
  text: {
    padding: 0,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
  },
}));

export default IconButton;
