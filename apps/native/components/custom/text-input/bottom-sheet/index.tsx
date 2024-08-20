import { memo } from 'react';
import { TextInputProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TextInput from '@/components/ui/text-input';

import { useBottomSheetTextInput } from './__hooks/useBottomSheetTextInput';

interface BottomSheetTextInputProps extends TextInputProps {}

const BottomSheetTextInput = memo(function BottomSheetTextInput({
  onFocus,
  onBlur,
  ...restProps
}: BottomSheetTextInputProps) {
  const { styles, theme } = useStyles(stylesheet);
  const { handleOnBlur, handleOnFocus } = useBottomSheetTextInput({ onBlur, onFocus });

  return (
    <TextInput.Root variants="outlined" style={styles.textInputRoot}>
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
  textInputRoot: {
    borderRadius: theme.borderRadius.md,
    // backgroundColor: theme.colors.lightShadow,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderColor: theme.colors.lightShadow,
    minHeight: 200,
  },
  textInputField: {
    color: theme.colors.typography,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    lineHeight: theme.fontSize.md * 1.5,
  },
}));

export default BottomSheetTextInput;
