import { TextInput as NativeTextInput, TextInputProps as NativeTextInputProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Util from '@/libs/util';

interface TextInputProps extends NativeTextInputProps {}

function TextInput({ style, ...props }: TextInputProps) {
  const { styles } = useStyles(stylesheet);

  return <NativeTextInput style={[styles.input, style]} {...props} />;
}

const stylesheet = createStyleSheet(theme => ({
  input: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Util.hexToRgba(theme.colors.typography, 0.6),
  },
}));

export default TextInput;
