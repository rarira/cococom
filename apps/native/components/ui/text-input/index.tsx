import { memo } from 'react';
import {
  Pressable,
  PressableProps,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewProps,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Icon, { IconProps } from '@/components/ui/icon';
import Util from '@/libs/util';

interface TextInputWrapperProps extends ViewProps {
  variants?: 'outlined' | 'underlined' | 'rounded';
}

const TextInputWrapper = memo(function TextInputWrapper({
  style,
  variants = 'outlined',
  ...restProps
}: TextInputWrapperProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View
      style={[styles.wrapperContainer, [variants ? styles[variants] : {}], style]}
      {...restProps}
    />
  );
});

const TextInputField = memo(function TextInputField({ style, ...restProps }: RNTextInputProps) {
  const { styles } = useStyles(stylesheet);

  return <RNTextInput style={[styles.field, style]} {...restProps} />;
});

const TextInputSlot = memo(function TextInputSlot({ style, ...restProps }: PressableProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      style={state => [styles.slot, typeof style === 'function' ? style(state) : style]}
      {...restProps}
    />
  );
});

const TextInputIcon = memo(function TextInputIcon({ style, ...restProps }: IconProps) {
  const { theme } = useStyles();
  return (
    <Icon style={style} size={theme.fontSize.lg} color={theme.colors.typography} {...restProps} />
  );
});

const stylesheet = createStyleSheet(theme => ({
  wrapperContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    width: '100%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Util.hexToRgba(theme.colors.typography, 0.6),
  },
  underlined: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Util.hexToRgba(theme.colors.typography, 0.6),
  },
  rounded: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Util.hexToRgba(theme.colors.typography, 0.6),
  },
  field: {
    flex: 1,
    color: theme.colors.typography,
    fontSize: theme.fontSize.md,
  },
  slot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const TextInput = {
  Root: TextInputWrapper,
  Field: TextInputField,
  Slot: TextInputSlot,
  Icon: TextInputIcon,
};

export default TextInput;
