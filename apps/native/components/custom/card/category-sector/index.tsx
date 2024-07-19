import { Link } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';

import { DiscountsByCategorySector } from '../../list/category-sector';

interface CategorySectorCardProps {
  categorySector: Awaited<DiscountsByCategorySector>[number];
}

function CategorySectorCard({ categorySector }: CategorySectorCardProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Link href={`/sales?categorySector=${categorySector}`}>
      <Text>{categorySector.categorySector}</Text>
    </Link>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {},
}));

export default CategorySectorCard;
