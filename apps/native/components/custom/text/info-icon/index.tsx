import { memo } from 'react';
import { View } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Icon, { IconProps } from '@/components/ui/icon';
import Text, { TextProps } from '@/components/ui/text';

interface InfoIconTextProps extends ViewProps {
  iconProps: IconProps;
  textProps: TextProps;
}

const InfoIconText = memo(function InfoIconText({
  style,
  iconProps,
  textProps: { style: textStyle, ...restTextProps },
  ...restProps
}: InfoIconTextProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={[styles.container, style]} {...restProps}>
      <Icon color={theme.colors.typography} {...iconProps} />
      <Text style={[styles.text, textStyle]} {...restTextProps} />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  text: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
  },
}));

export default InfoIconText;
