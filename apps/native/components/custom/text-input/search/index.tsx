import { memo } from 'react';
import { TextInputProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TextInput from '@/components/ui/text-input';

interface SearchTextInputProps extends TextInputProps {
  onPressSearch: () => void;
  disabled?: boolean;
}

const SearchTextInput = memo(function SearchTextInput({
  onPressSearch,
  disabled,
  ...restProps
}: SearchTextInputProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <TextInput.Root variants="rounded" style={styles.textInputRoot}>
      <TextInput.Field
        placeholderTextColor={`${theme.colors.typography}99`}
        editable={!disabled}
        autoCorrect={false}
        autoComplete="off"
        autoCapitalize="none"
        clearButtonMode="while-editing"
        {...restProps}
      />
      <TextInput.Slot style={styles.textInputSlot} onPress={onPressSearch} disabled={disabled}>
        <TextInput.Icon font={{ type: 'MaterialIcon', name: 'search' }} />
      </TextInput.Slot>
    </TextInput.Root>
  );
});

const stylesheet = createStyleSheet(theme => ({
  textInputRoot: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.lightShadow,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderColor: theme.colors.lightShadow,
  },
  textInputSlot: {
    paddingRight: theme.spacing.sm,
  },
}));

export default SearchTextInput;
