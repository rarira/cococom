import { memo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SearchTextInput from '@/components/custom/text-input/search';
import Text from '@/components/ui/text';

interface SearchScreenProps {}

const SearchScreen = memo(function SearchScreen({}: SearchScreenProps) {
  const { styles } = useStyles(stylesheet);

  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.container(top)}>
      <Text>Search</Text>
      <SearchTextInput />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number) => ({
    flex: 1,
    paddingTop: topInset,
    paddingHorizontal: theme.screenHorizontalPadding,
    backgroundColor: theme.colors.background,
  }),
}));

export default SearchScreen;
