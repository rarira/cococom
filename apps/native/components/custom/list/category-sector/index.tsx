import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useCategorySectorsStore } from '@/store/category-sector';

import CategorySectorGroupView from '../../view/category-sector-group';

interface CategorySectorListProps {}

function fetchCurrentDiscountsByCategorySector() {
  const currentTimestamp = new Date().toISOString().split('T')[0];
  return supabase.fetchCurrentDiscountsByCategorySector(currentTimestamp);
}

export type DiscountsByCategorySector = NonNullable<
  ReturnType<typeof fetchCurrentDiscountsByCategorySector>
>;

const NumberOfColumns = 4;

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

  useEffect(() => {
    const categorySectors = data?.map(item => item.categorySector) ?? [];
    setCategorySectorsArray(categorySectors);
  }, [data, setCategorySectorsArray]);

  const renderItem = useCallback(
    ({ item, index }: { item: NonNullable<typeof data>[number][]; index: number }) => {
      return <CategorySectorGroupView group={item} key={index} />;
    },
    [],
  );

  const chunkedData = useMemo(
    () =>
      data?.reduce(
        (acc, item, index) => {
          const chunkIndex = Math.floor(index / NumberOfColumns);
          if (!acc[chunkIndex]) {
            acc[chunkIndex] = [];
          }
          acc[chunkIndex].push(item);
          return acc;
        },
        [] as (typeof data)[number][][],
      ) ?? [],
    [data],
  );

  if (error || !data || isLoading) return null;

  return (
    <FlashList
      data={chunkedData}
      renderItem={renderItem}
      estimatedItemSize={itemWidth}
      keyExtractor={item => item[0].itemId.toString()}
      numColumns={1}
      ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
      contentContainerStyle={styles.container}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: { padding: theme.screenHorizontalPadding },
  seperatorStyle: {
    height: theme.spacing.lg,
  },
}));

export default CategorySectorList;
