import { Database } from '@cococom/supabase/types';
import { PortalHost } from '@gorhom/portal';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SearchResultListItemCard from '@/components/custom/card/list-item/search-result';
import { PortalHostNames } from '@/constants';

export type SearchResult = Database['public']['Functions']['search_items_by_keyword']['Returns'];

interface SearchResultListProps {
  searchResult: SearchResult;
}

const SearchResultList = memo(function SearchResultList({ searchResult }: SearchResultListProps) {
  const { styles } = useStyles(stylesheet);

  const renderItem = useCallback(({ item }: { item: SearchResult[number]; index: number }) => {
    return <SearchResultListItemCard item={item} key={item.id} />;
  }, []);

  return (
    <>
      <FlashList
        data={searchResult}
        renderItem={renderItem}
        estimatedItemSize={600}
        keyExtractor={item => item?.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
        contentContainerStyle={styles.flashListContainer}
      />
      <PortalHost name={PortalHostNames.SEARCH} />
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: {
    paddingTop: theme.spacing.lg * 1.5,
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
}));

export default SearchResultList;
