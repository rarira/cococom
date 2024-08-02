import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/ui/card';
import Text from '@/components/ui/text';
import { shadowPresets } from '@/libs/shadow';

import { DiscountsByCategorySector } from '../../list/category-sector';

interface CategorySectorCardProps {
  discountInfo: Awaited<DiscountsByCategorySector>[number] | null;
}

function CategorySectorCard({ discountInfo }: CategorySectorCardProps) {
  const { styles, theme } = useStyles(stylesheet);

  if (discountInfo === null) return <View style={styles.cardContainer} />;

  return (
    <Link
      href={`/sales?categorySector=${discountInfo.categorySector}`}
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <Shadow {...shadowPresets.card(theme)}>
        <Card style={styles.cardContainer}>
          <View style={styles.imageContainer}>
            <Image
              // TODO: 상품별 이미지로 변경
              source={`https://picsum.photos/150/150`}
              contentFit="cover"
              alt={`${discountInfo.categorySector} thumbnail image`}
              style={styles.image}
            />
          </View>
          <View style={styles.infoContaier}>
            <View style={styles.categoryNameContainer}>
              <Text style={styles.categoryName} numberOfLines={2}>
                {discountInfo.categorySector}
              </Text>
            </View>
            <Text style={styles.count}>{discountInfo.discountsCount}개의 할인</Text>
          </View>
        </Card>
      </Shadow>
    </Link>
  );
}

const stylesheet = createStyleSheet(theme => ({
  cardContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1 / 1,
  },
  image: {
    flex: 1,
  },
  infoContaier: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  categoryNameContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 35,
  },
  categoryName: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.md,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  count: {
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    opacity: 0.8,
    color: theme.colors.tint3,
  },
}));

export default CategorySectorCard;
