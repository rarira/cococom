import { Link } from 'expo-router';
import { View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/ui/card';
import Text from '@/components/ui/text';
import { shadowPresets } from '@/libs/shadow';

import { DiscountsByCategorySector } from '../../list/category-sector';

interface CategorySectorCardProps {
  discountInfo: Awaited<DiscountsByCategorySector>[number];
  width: number;
  gap: number;
}

function CategorySectorCard({ discountInfo, width, gap }: CategorySectorCardProps) {
  const { styles, theme } = useStyles(stylesheet);

  console.log(width, { discountInfo });
  return (
    <Link href={`/sales?categorySector=${discountInfo.categorySector}`}>
      <Shadow {...shadowPresets.card(theme)} style={styles.container}>
        <Card style={styles.cardContainer(width, gap)}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text>{discountInfo.categorySector}</Text>
          </View>
        </Card>
      </Shadow>
    </Link>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    width: '100%',
  },
  cardContainer: (width: number, paddingRight: number) => ({
    flex: 1,
    width,
    paddingRight,
    borderRadius: theme.borderRadius.md,
  }),
}));

export default CategorySectorCard;
