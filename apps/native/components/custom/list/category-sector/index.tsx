import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';

import CategorySectorCard from '../../card/category-sector';

interface CategorySectorListProps {}

function fetchCurrentDiscountsByCategorySector() {
  const currentTimestamp = new Date().toISOString().split('T')[0];

  return supabase.fetchCurrentDiscountsByCategorySector(currentTimestamp);
}

export type DiscountsByCategorySector = NonNullable<
  ReturnType<typeof fetchCurrentDiscountsByCategorySector>
>;

function CategorySectorList() {
  const { styles } = useStyles(stylesheet);

  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.discounts.currentListByCategorySector(),
    queryFn: () => fetchCurrentDiscountsByCategorySector(),
  });

  console.log('current data', { data, error });

  const renderItem = useCallback(({ item }: { item: NonNullable<typeof data>[number] }) => {
    return <CategorySectorCard discountInfo={item} key={item.id} />;
  }, []);

  if (error || !data || isLoading) return null;

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={600}
      keyExtractor={item => item.id.toString()}
      numColumns={3}
      ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
      contentContainerStyle={styles.container}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: { padding: theme.spacing.xl },
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
}));

export default CategorySectorList;
