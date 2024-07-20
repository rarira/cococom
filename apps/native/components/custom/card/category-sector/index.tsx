import { Link } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';

import { DiscountsByCategorySector } from '../../list/category-sector';

interface CategorySectorCardProps {
  discountInfo: Awaited<DiscountsByCategorySector>[number];
}

function CategorySectorCard({ discountInfo }: CategorySectorCardProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Link href={`/sales?categorySector=${discountInfo.categorySector}`}>
      <Text>{discountInfo.categorySector}</Text>
    </Link>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {},
}));

export default CategorySectorCard;
