import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import TextInput from '@/components/ui/text-input';

interface SearchTextInputProps {}

const SearchTextInput = memo(function SearchTextInput({}: SearchTextInputProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <TextInput.Root variants="rounded" style={styles.textInputRoot}>
      <TextInput.Slot style={styles.textInputSlot}>
        <TextInput.Icon font={{ type: 'MaterialIcon', name: 'search' }} />
      </TextInput.Slot>
      <TextInput.Field
        placeholder="검색어를 입력하고 검색 버튼을 누르세요"
        placeholderTextColor={`${theme.colors.background}99`}
        style={styles.textInputField}
      />
      <TextInput.Slot
        style={state => styles.searachButton(state)}
        onPress={() => console.log('검색하기')}
      >
        <Text style={styles.searchButtonText}>검색</Text>
      </TextInput.Slot>
    </TextInput.Root>
  );
});

const stylesheet = createStyleSheet(theme => ({
  textInputRoot: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.typography,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderColor: theme.colors.typography,
  },
  textInputSlot: {
    paddingRight: theme.spacing.sm,
  },
  textInputField: {
    color: theme.colors.background,
  },
  searachButton: ({ pressed }: { pressed: boolean }) => ({
    paddingLeft: theme.spacing.sm,
    opacity: pressed ? 0.5 : 1,
  }),
  searchButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
}));

export default SearchTextInput;
