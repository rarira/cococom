import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface SearchScreenProps {}

const SearchScreen = memo(function SearchScreen({}: SearchScreenProps) {
  const { styles } = useStyles(stylesheet);

  return <></>;
});

const stylesheet = createStyleSheet(theme => ({
  container: {},
}));

export default SearchScreen;
