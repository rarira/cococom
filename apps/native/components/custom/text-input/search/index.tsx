import { memo, useCallback, useLayoutEffect, useState } from 'react';
import { TextInputProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TextInput from '@/components/core/text-input';

interface SearchTextInputProps extends TextInputProps {
  // onPressSearch: () => void;

  // options: SearchOptionValue[];
  keywordToSearch: string;
  onPressSearch: (keyword: string) => void;
  disabled?: boolean;
}

const SearchTextInput = memo(function SearchTextInput({
  onPressSearch,
  disabled,
  keywordToSearch,
  ...restProps
}: SearchTextInputProps) {
  const { styles, theme } = useStyles(stylesheet);

  const [keyword, setKeyword] = useState('');

  useLayoutEffect(() => {
    setKeyword(keywordToSearch);
  }, [keywordToSearch]);

  const handlePress = useCallback(() => {
    onPressSearch(keyword);
  }, [keyword, onPressSearch]);

  return (
    <TextInput.Root variants="outlined" rowStyle={styles.textInputRoot}>
      <TextInput.Field
        value={keyword}
        placeholderTextColor={`${theme.colors.typography}99`}
        editable={!disabled}
        autoCorrect={false}
        autoComplete="off"
        autoCapitalize="none"
        clearButtonMode="while-editing"
        onChangeText={setKeyword}
        {...restProps}
      />
      <TextInput.Slot style={styles.textInputSlot} onPress={handlePress} disabled={disabled}>
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
    paddingHorizontal: theme.spacing.md,
    borderColor: theme.colors.lightShadow,
  },
  textInputSlot: {
    paddingRight: theme.spacing.sm,
  },
}));

export default SearchTextInput;
