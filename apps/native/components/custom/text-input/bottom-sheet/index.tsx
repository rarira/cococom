import { memo } from 'react';
import { TextInputProps } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TextInput from '@/components/ui/text-input';

import { useBottomSheetTextInput } from './__hooks/useBottomSheetTextInput';

interface BottomSheetTextInputProps extends TextInputProps {
  rootStyle?: ViewProps['style'];
  renderButton?: () => JSX.Element;
}

const BottomSheetTextInput = memo(function BottomSheetTextInput({
  onFocus,
  onBlur,
  rootStyle,
  defaultValue,
  maxLength,
  renderButton,
  ...restProps
}: BottomSheetTextInputProps) {
  const { styles, theme } = useStyles(stylesheet);
  const { handleOnBlur, handleOnFocus } = useBottomSheetTextInput({ onBlur, onFocus });

  return (
    <TextInput.Root
      variants="outlined"
      style={[styles.textInputRoot, rootStyle]}
      defaultValue={defaultValue}
      maxLength={maxLength}
      renderButton={renderButton}
    >
      <TextInput.Field
        multiline
        placeholderTextColor={`${theme.colors.typography}99`}
        placeholder="Add Memo"
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        autoCorrect={false}
        autoComplete="off"
        autoCapitalize="none"
        clearButtonMode="while-editing"
        style={styles.textInputField}
        {...restProps}
      />
    </TextInput.Root>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'column',
  },
  textInputRoot: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderColor: `${theme.colors.typography}99`,
  },
  textInputField: {
    color: theme.colors.typography,
    fontSize: theme.fontSize.md,
    lineHeight: theme.fontSize.md * 1.5,
  },
}));

export default BottomSheetTextInput;
