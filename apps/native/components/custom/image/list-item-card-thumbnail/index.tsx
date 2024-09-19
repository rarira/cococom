import { Tables } from '@cococom/supabase/types';
import { Image } from 'expo-image';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
interface ListItemCardThumbnailImageProps {
  product: Partial<Tables<'items'>> & Record<string, any>;
  width: DimensionValue;
  height: DimensionValue;
  style?: StyleProp<ViewStyle>;
}

function ListItemCardThumbnailImage({
  product,
  width,
  height,
  style,
}: ListItemCardThumbnailImageProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={[styles.container(width, height), style]}>
      <Image
        source={`https://picsum.photos/${width}/${height}`}
        contentFit="cover"
        alt={`${product.itemName} thumbnail image`}
        style={styles.image}
      />
      <View style={styles.itemIdOverlay}>
        <Text style={styles.itemIdText}>{product.itemId}</Text>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (width: DimensionValue, height: DimensionValue) => ({
    width,
    height,
    overflow: 'hidden',
    aspectRatio: 1 / 1,
  }),
  image: {
    flex: 1,
  },
  itemIdOverlay: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    opacity: 0.8,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  itemIdText: {
    color: theme.colors.typography,
    fontSize: theme.fontSize.xs,
    lineHeight: theme.fontSize.xs * 1.5,
    fontWeight: 'bold',
  },
}));

export default ListItemCardThumbnailImage;
