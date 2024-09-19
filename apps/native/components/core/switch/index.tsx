import { memo, useCallback } from 'react';
import { Pressable, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Icon, { IconProps } from '@/components/core/icon';
import Text, { TextProps } from '@/components/core/text';

interface SwitchProps extends ViewProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelProps?: TextProps;
}

const CheckboxIconFont = { type: 'FontAwesomeIcon', name: 'check' };

const Switch = memo(function Switch({
  checked,
  onChange,
  labelProps: { style: labelStyle, ...restLabelProps } = {},
  style,
  ...restProps
}: SwitchProps) {
  const { styles, theme } = useStyles(stylesheet);

  const handlePress = useCallback(() => {
    onChange(!checked);
  }, [onChange, checked]);

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.container, style]} {...restProps}>
        <View style={styles.indicator(checked)}>
          <Icon
            style={styles.icon}
            size={theme.fontSize.sm}
            color={theme.colors.background}
            font={CheckboxIconFont as IconProps['font']}
          />
        </View>
        <Text style={[styles.label, labelStyle]} {...restLabelProps} />
      </View>
    </Pressable>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  indicator: (checked: boolean) => ({
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.fontSize.md,
    height: theme.fontSize.md,
    borderRadius: theme.fontSize.md / 4,
    backgroundColor: checked ? theme.colors.tint : 'transparent',
    borderColor: checked ? theme.colors.tint : theme.colors.typography,
    borderWidth: 1,
  }),
  label: {
    color: theme.colors.typography,
    fontSize: theme.fontSize.sm,
  },
  icon: {
    fontWeight: 'bold',
  },
}));

export default Switch;
