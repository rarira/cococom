import {
  Pressable,
  PressableProps,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewProps,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text, { TextProps } from '@/components/ui/text';
import Util from '@/libs/util';

interface TextInputFieldProps extends RNTextInputProps {
  outlined?: boolean;
}

function TextInputWrapper({ style, ...restProps }: ViewProps) {
  const { styles } = useStyles(stylesheet);

  return <View style={[styles.wrapperContainer, style]} {...restProps} />;
}

function TextInputField({ style, outlined = true, ...restProps }: TextInputFieldProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <RNTextInput style={[styles.input, [outlined ? styles.outlined : {}], style]} {...restProps} />
  );
}

function TextInputLabel({ style, ...restProps }: TextProps) {
  return <Text style={style} {...restProps} />;
}

function TextInputSlot({ style, ...restProps }: PressableProps) {
  return <Pressable style={style} {...restProps} />;
}

function TextInputIcon({ style, ...restProps }: TextProps) {
  return <Text style={style} {...restProps} />;
}

const stylesheet = createStyleSheet(theme => ({
  wrapperContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  input: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,

    color: theme.colors.typography,
    fontSize: theme.fontSize.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Util.hexToRgba(theme.colors.typography, 0.6),
  },
}));

export default TextInputField;
