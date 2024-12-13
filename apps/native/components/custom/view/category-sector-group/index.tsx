import { Fragment, memo, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CategorySectorCard from '@/components/custom/card/category-sector';
import { DiscountsByCategorySector } from '@/components/custom/list/category-sector';

interface CategorySectorGroupViewProps {
  group: (Awaited<DiscountsByCategorySector>[number] | null)[];
}

const CategorySectorGroupView = memo(function CategorySectorGroupView({
  group,
}: CategorySectorGroupViewProps) {
  const { styles } = useStyles(stylesheet);

  const row = useMemo(
    () => (
      <Fragment>
        {group.map((disountInfo, index) => {
          return (
            <CategorySectorCard
              discountInfo={disountInfo}
              key={disountInfo?.itemId || `null-${index}`}
            />
          );
        })}
      </Fragment>
    ),
    [group],
  );

  return <View style={styles.container}>{row}</View>;
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
  },
  itemContaier: {
    flex: 1,
    height: '100%',
  },
}));

export default CategorySectorGroupView;
