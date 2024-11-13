import { Tables } from '@cococom/supabase/types';
import { Image } from 'expo-image';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { getImagekitUrlFromPath } from '@cococom/imagekit/client';
import { useMemo } from 'react';

import Text from '@/components/core/text';
import Util from '@/libs/util';
import item from '@/app/(main)/(tabs)/(home, my, search, ranking)/item';
interface ListItemCardThumbnailImageProps {
  product: Partial<Tables<'items'>> & Record<string, any>;
  width: DimensionValue;
  height: DimensionValue;
  isOnline?: boolean;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}

function ListItemCardThumbnailImage({
  product,
  width,
  height,
  style,
  isOnline = false,
  small,
}: ListItemCardThumbnailImageProps) {
  const { styles } = useStyles(stylesheet);

  const itemImageUrl = useMemo(() => {
    return getImagekitUrlFromPath({
      imagePath: `products/${Util.extractItemid(product.itemId!)}.webp`,
      transformationArray: [{ height: height?.toString(), width: width?.toString() }],
    });
  }, [height, product.itemId, width]);

  return (
    <View style={[styles.container(width, height), style]}>
      <Image
        source={itemImageUrl}
        contentFit="contain"
        alt={`${product.itemName} thumbnail image`}
        style={styles.image}
      />
      <View style={styles.itemIdOverlay(isOnline)}>
        <Text style={styles.itemIdText(isOnline)}>
          {(isOnline ? `온라인,${small ? '\n' : ' '}` : '') + Util.extractItemid(product.itemId!)}
        </Text>
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
    borderColor: theme.colors.lightShadow,
    borderWidth: 1,
  }),
  image: {
    flex: 1,
  },
  itemIdOverlay: (isOnline: boolean) => ({
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: isOnline ? theme.colors.tint3 : theme.colors.background,
    opacity: isOnline ? 1 : 0.8,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  }),
  itemIdText: (isOnline: boolean) => ({
    color: isOnline ? 'white' : theme.colors.typography,
    fontSize: theme.fontSize.xs,
    lineHeight: theme.fontSize.xs * 1.5,
    fontWeight: 'bold',
  }),
  onlineOverlay: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.alert,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  onlineText: {
    color: 'white',
    fontSize: theme.fontSize.md,
    lineHeight: theme.fontSize.md * 1.5,
    fontWeight: 'bold',
  },
}));

export default ListItemCardThumbnailImage;
