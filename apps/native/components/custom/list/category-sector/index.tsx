import { CategorySectors } from '@cococom/supabase/types';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useCategorySectorsStore } from '@/store/category-sector';
import CategorySectorGroupView from '@/components/custom/view/category-sector-group';

function fetchCurrentDiscountsByCategorySector() {
  const currentTimestamp = new Date().toISOString();
  return supabase.discounts.fetchCurrentDiscountsByCategorySector(currentTimestamp);
}

export type DiscountsByCategorySector = NonNullable<
  ReturnType<typeof fetchCurrentDiscountsByCategorySector>
>;

const NumberOfColumns = 4;

interface CategorySectorListProps {
  setTotalDiscounts: Dispatch<SetStateAction<number>>;
}

function CategorySectorList({ setTotalDiscounts }: CategorySectorListProps) {
  const { styles, theme } = useStyles(stylesheet);

  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.category.all(),
    queryFn: fetchCurrentDiscountsByCategorySector,
  });

  const { width } = useWindowDimensions();
  const setCategorySectorsArray = useCategorySectorsStore(state => state.setCategorySectorsArray);

  const horizontalGap = theme.spacing.lg;
  const itemWidth =
    (width - horizontalGap * 2 - theme.screenHorizontalPadding * 2) / NumberOfColumns;

  useEffect(() => {
    const reduced = data?.reduce(
      (acc, item) => {
        acc.totalDiscounts += (item.discountsCountOnline || 0) + (item.discountsCountOffline || 0);
        acc.categorySectorsArray.push(item.categorySector);
        return acc;
      },
      { totalDiscounts: 0, categorySectorsArray: [] } as {
        totalDiscounts: number;
        categorySectorsArray: CategorySectors[];
      },
    );
    setCategorySectorsArray(reduced?.categorySectorsArray ?? []);
    setTotalDiscounts(reduced?.totalDiscounts ?? 0);
  }, [data, setCategorySectorsArray, setTotalDiscounts]);

  const renderItem = useCallback(
    ({ item, index }: { item: NonNullable<typeof data>[number][]; index: number }) => {
      return <CategorySectorGroupView group={item} key={index} />;
    },
    [],
  );

  const chunkedData = useMemo(() => {
    const matrix =
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
      ) ?? [];

    if (matrix.length === 0) return matrix;

    const lastRowLength = matrix[matrix.length - 1].length;

    if (lastRowLength < NumberOfColumns) {
      const emptyItems = new Array(NumberOfColumns - lastRowLength).fill(null);
      matrix[matrix.length - 1] = matrix[matrix.length - 1].concat(emptyItems);
    }

    return matrix;
  }, [data]);

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
  container: {
    paddingRight: theme.spacing.sm,
  },
  seperatorStyle: {
    height: theme.spacing.lg,
  },
}));

export default CategorySectorList;
