import { Database } from '@cococom/supabase/types';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';

export type SearchResult = Database['public']['Functions']['search_items_by_keyword']['Returns'];

interface SearchResultListProps {
  searchResult: SearchResult;
}

const SearchResultList = memo(function SearchResultList({ searchResult }: SearchResultListProps) {
  const { styles } = useStyles(stylesheet);

  const renderItem = useCallback(({ item }: { item: SearchResult[number]; index: number }) => {
    return <Text>{item.itemName}</Text>;
  }, []);

  return (
    <FlashList
      data={searchResult}
      renderItem={renderItem}
      estimatedItemSize={600}
      keyExtractor={item => item?.id.toString()}
      ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
      contentContainerStyle={styles.flashListContainer}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: {
    paddingTop: theme.spacing.md,
  },
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
}));

export default SearchResultList;
