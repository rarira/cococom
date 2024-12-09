import { memo } from 'react';
import { Pressable, PressableProps, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Icon, { IconProps } from '@/components/core/icon';
import Text, { TextProps } from '@/components/core/text';
import ToggleSwitch, { ToggleSwitchProps } from '@/components/core/switch/toggle';
interface DefaultRowMenuWrapperProps extends ViewProps {
  type?: 'default';
}

interface NavRowMenuWrapperProps extends PressableProps {
  type: 'nav';
}

type RowMenuWrapperProps = DefaultRowMenuWrapperProps | NavRowMenuWrapperProps;

const RowMenuWrapper = memo(function RowMenuWrapper({
  type = 'default',
  style,
  children,
  ...restProps
}: RowMenuWrapperProps) {
  const { styles } = useStyles(stylesheet);

  if (type === 'nav') {
    return (
      <Pressable
        style={state => [
          styles.container,
          styles.pressableContainer(state),
          typeof style === 'function' ? style(state) : style,
        ]}
        {...(restProps as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, style]} {...restProps}>
      {children}
    </View>
  );
});

const RowMenuText = memo(function RowMenuText({ style, ...restProps }: TextProps) {
  const { styles } = useStyles(stylesheet);

  return <Text style={[styles.text, style]} {...restProps} />;
});

const RowMenuNavButton = memo(function RowMenuNavButton(props: Omit<IconProps, 'font'>) {
  const { theme } = useStyles();

  return (
    <Icon
      font={{ type: 'Ionicon', name: 'chevron-forward' }}
      size={theme.fontSize.xl}
      color={theme.colors.typography}
      {...props}
    />
  );
});

const RowMenuToggleSwitch = memo(function RowMenuToggleSwitch(props: ToggleSwitchProps) {
  return <ToggleSwitch {...props} />;
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.modalBackground,
  },
  pressableContainer: ({ pressed }: { pressed: boolean }) => ({
    opacity: pressed ? 0.5 : 1,
  }),
  text: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    lineHeight: theme.fontSize.md * 1.5,
  },
}));

const RowMenu = RowMenuWrapper as typeof RowMenuWrapper & {
  // Root: RowMenuWrapper,
  Text: typeof RowMenuText;
  NavButton: typeof RowMenuNavButton;
  ToggleSwitch: typeof RowMenuToggleSwitch;
};
RowMenu.Text = RowMenuText;
RowMenu.NavButton = RowMenuNavButton;
RowMenu.ToggleSwitch = RowMenuToggleSwitch;

export default RowMenu;
