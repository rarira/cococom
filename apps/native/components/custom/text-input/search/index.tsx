import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TextInput from '@/components/ui/text-input';

interface SearchTextInputProps {}

const SearchTextInput = memo(function SearchTextInput({}: SearchTextInputProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <TextInput.Root variants="rounded" style={styles.textInputRoot}>
      <TextInput.Field
        placeholder="검색어를 입력하고 검색 버튼을 누르세요"
        placeholderTextColor={`${theme.colors.typography}99`}
      />
      <TextInput.Slot style={styles.textInputSlot} onPress={() => console.log('검색 실행')}>
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
