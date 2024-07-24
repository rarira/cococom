import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useCategorySectorsStore } from '@/store/category-sector';

import CategorySectorCard from '../../card/category-sector';

interface CategorySectorListProps {}

function fetchCurrentDiscountsByCategorySector() {
  const currentTimestamp = new Date().toISOString().split('T')[0];
  return supabase.fetchCurrentDiscountsByCategorySector(currentTimestamp);
}

export type DiscountsByCategorySector = NonNullable<
  ReturnType<typeof fetchCurrentDiscountsByCategorySector>
>;

const NumberOfColumns = 3;

function CategorySectorList() {
  const { styles, theme } = useStyles(stylesheet);

  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.discounts.currentListByCategorySector(),
    queryFn: () => fetchCurrentDiscountsByCategorySector(),
  });

  const { width } = useWindowDimensions();
  const { setCategorySectorsArray } = useCategorySectorsStore();

  const horizontalGap = theme.spacing.lg;
  const itemWidth =
    (width - horizontalGap * 2 - theme.screenHorizontalPadding * 2) / NumberOfColumns;

  console.log('itemWidth', itemWidth);
  useEffect(() => {
    const categorySectors = data?.map(item => item.categorySector) ?? [];
    setCategorySectorsArray(categorySectors);
  }, [data, setCategorySectorsArray]);

  const renderItem = useCallback(
    ({ item, index }: { item: NonNullable<typeof data>[number]; index: number }) => {
      return (
        <CategorySectorCard
          discountInfo={item}
          key={item.id}
          width={itemWidth}
          gap={index % NumberOfColumns === 2 ? 0 : horizontalGap}
        />
      );
    },
    [horizontalGap, itemWidth],
  );

  if (error || !data || isLoading) return null;

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={itemWidth}
      keyExtractor={item => item.id.toString()}
      numColumns={NumberOfColumns}
      ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
      contentContainerStyle={styles.container}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: { padding: theme.screenHorizontalPadding },
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
}));

export default CategorySectorList;
