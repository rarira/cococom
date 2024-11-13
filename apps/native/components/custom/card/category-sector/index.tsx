import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useMemo } from 'react';
import { getImagekitUrlFromPath } from '@cococom/imagekit/client';

import Card from '@/components/core/card';
import Text from '@/components/core/text';
import { ShadowPresets } from '@/libs/shadow';
import Util from '@/libs/util';

import { DiscountsByCategorySector } from '../../list/category-sector';

interface CategorySectorCardProps {
  discountInfo: Awaited<DiscountsByCategorySector>[number] | null;
}

function CategorySectorCard({ discountInfo }: CategorySectorCardProps) {
  const { styles } = useStyles(stylesheet);

  const categoryItemImageUrl = useMemo(() => {
    if (!discountInfo) return '';
    return getImagekitUrlFromPath({
      imagePath: `products/${Util.extractItemid(discountInfo.itemId)}.webp`,
    });
  }, [discountInfo]);

  if (discountInfo === null) return <View style={styles.cardContainer} />;

  return (
    <Link
      href={`/sales?categorySector=${discountInfo.categorySector}`}
      style={styles.container}
      asChild
    >
      <Pressable>
        <Card style={styles.cardContainer}>
          <View>
            <View style={styles.imageContainer}>
              <Image
                source={categoryItemImageUrl}
                contentFit="cover"
                alt={`${discountInfo.categorySector} thumbnail image`}
                style={styles.image}
              />
            </View>
            <View style={styles.categoryNameContainer}>
              <Text style={styles.categoryName} numberOfLines={3}>
                {discountInfo.categorySector}
              </Text>
            </View>
          </View>
          <View style={styles.infoContaier}>
            <View style={styles.countContainer}>
              <View style={styles.countRow}>
                <View style={styles.countCell}>
                  <Text style={[styles.count, styles.countHeader]}>오프</Text>
                </View>
                <View style={styles.countCell}>
                  <Text style={[styles.count, styles.countHeader]}>온</Text>
                </View>
              </View>
              <View style={styles.countRow}>
                <View style={styles.countCell}>
                  <Text style={styles.count}>{discountInfo.discountsCountOffline}</Text>
                </View>
                <View style={styles.countCell}>
                  <Text style={styles.count}>{discountInfo.discountsCountOnline}</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: theme.borderRadius.md,
    borderColor: theme.colors.lightShadow,
    borderWidth: 1,
    ...ShadowPresets.card(theme),
  },
  imageContainer: {
    position: 'relative',
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  categoryNameContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background,
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  categoryName: {
    fontSize: theme.fontSize.normal,
    lineHeight: theme.fontSize.normal * 1.2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countContainer: {
    width: '100%',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  countCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countHeader: {
    opacity: 1,
    fontWeight: 'bold',
    color: theme.colors.tint3,
  },
  count: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
    textAlign: 'center',
    opacity: 0.8,
    color: theme.colors.tint3,
  },
}));

export default CategorySectorCard;
