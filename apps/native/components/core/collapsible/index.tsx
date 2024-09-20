import { memo, PropsWithChildren, useCallback, useState } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Icon, { IconProps } from '@/components/core/icon';
import Text, { TextProps } from '@/components/core/text';

export interface CollapsibleProps extends PropsWithChildren {
  title: string;
  containerStyle?: ViewProps['style'];
  contentStyle?: ViewProps['style'];
  headerStyle?: TouchableOpacityProps['style'];
  iconProps?: Partial<IconProps>;
  textProps?: TextProps;
}

function Collapsible({
  children,
  title,
  containerStyle,
  contentStyle,
  headerStyle,
  iconProps,
  textProps,
}: CollapsibleProps) {
  const { styles, theme } = useStyles(stylesheet);
  const [isOpen, setIsOpen] = useState(false);

  const handlePress = useCallback(() => setIsOpen(value => !value), []);

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={[styles.heading, headerStyle]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Icon
          font={{ type: 'Ionicon', name: isOpen ? 'chevron-down' : 'chevron-forward-outline' }}
          size={18}
          color={theme.colors.typography}
          {...iconProps}
        />
        <Text type="defaultSemiBold" {...textProps}>
          {title}
        </Text>
      </TouchableOpacity>
      {isOpen && <View style={[styles.content, contentStyle]}>{children}</View>}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  content: {
    marginTop: theme.spacing.md,
    marginLeft: theme.spacing.lg * 2,
  },
}));

export default memo(Collapsible);
