import { memo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SearchTextInput from '@/components/custom/text-input/search';
import Checkbox from '@/components/ui/checkbox';
import Text from '@/components/ui/text';

interface SearchScreenProps {}

const SearchScreen = memo(function SearchScreen({}: SearchScreenProps) {
  const { styles, theme } = useStyles(stylesheet);

  const { top } = useSafeAreaInsets();

  const [values, setValues] = useState<string[]>(['product_number']);

  return (
    <View style={styles.container(top)}>
      <Text>Search</Text>
      <SearchTextInput />
      <Checkbox.Group value={values} onChange={setValues}>
        <Checkbox.Root value={'product_number'} defaultIsChecked>
          <Checkbox.Indicator>
            <Checkbox.Icon font={{ type: 'FontAwesomeIcon', name: 'check' }} />
          </Checkbox.Indicator>
          <Checkbox.Label>상품번호로 검색</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root value={'new'}>
          <Checkbox.Indicator>
            <Checkbox.Icon font={{ type: 'FontAwesomeIcon', name: 'check' }} />
          </Checkbox.Indicator>
          <Checkbox.Label>할인 중인 상품만</Checkbox.Label>
        </Checkbox.Root>
      </Checkbox.Group>
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
