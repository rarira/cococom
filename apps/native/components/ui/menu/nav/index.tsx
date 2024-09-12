import { memo } from 'react';
import { Pressable, PressableProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Icon, { IconProps } from '@/components/ui/icon';
import Text, { TextProps } from '@/components/ui/text';

interface NavMenuProps extends PressableProps {
  textProps: TextProps;
  iconProps?: Omit<IconProps, 'font'>;
}

const NavMenu = memo(function NavMenu({
  style,
  textProps: { style: textStyle, ...restTextProps },
  iconProps,
  ...restProps
}: NavMenuProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Pressable
      style={state => [styles.container(state), typeof style === 'function' ? style(state) : style]}
      {...restProps}
    >
      <Text style={[styles.text, textStyle]} {...restTextProps} />
      <Icon
        font={{ type: 'MaterialIcon', name: 'chevron-right' }}
        size={theme.fontSize.xl}
        color={theme.colors.typography}
        {...iconProps}
      />
    </Pressable>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: ({ pressed }: { pressed: boolean }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: pressed ? 0.5 : 1,
    paddingVertical: theme.spacing.lg,
    borderBottomColor: theme.colors.lightShadow,
    borderBottomWidth: 1,
  }),
  text: {
    fontSize: theme.fontSize.md,
    fontWeight: 'semibold',
    lineHeight: theme.fontSize.md * 1.5,
  },
}));

export default NavMenu;
