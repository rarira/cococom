import { memo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import TextInput from '@/components/ui/text-input';

interface SearchScreenProps {}

const SearchScreen = memo(function SearchScreen({}: SearchScreenProps) {
  const { styles, theme } = useStyles(stylesheet);

  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.container(top)}>
      <Text>Search</Text>
      <TextInput placeholder="검색어를 입력하세요" />
      {/* <Stack.Screen
        options={{
          headerShown: true,
          contentStyle: { borderColor: 'red', borderWidth: 1 },

          // headerSearchBarOptions: {
          //   placeholder: '검색어를 입력하세요',
          //   autoFocus: true,
          //   onChangeText: e => console.log(e),
          //   onSearchButtonPress: () => console.log('search'),
          // },r
          // headerStyle: { backgroundColor: theme.colors.background },
          // headerTitleStyle: { color: theme.colors.typography },
        }}
      /> */}
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number) => ({
    flex: 1,
    paddingTop: topInset,
    paddingHorizontal: theme.screenHorizontalPadding,
  }),
}));

export default SearchScreen;
