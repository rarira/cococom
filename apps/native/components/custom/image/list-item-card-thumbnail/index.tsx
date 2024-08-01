import { Tables } from '@cococom/supabase/types';
import { Image } from 'expo-image';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface ListItemCardThumbnailImageProps {
  product: Partial<Tables<'items'>>;
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
}));

export default ListItemCardThumbnailImage;
