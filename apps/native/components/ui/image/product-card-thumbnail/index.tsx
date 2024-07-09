import { Tables } from '@cococom/supabase/types';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

function ProductCardThumbnailImage({ product }: { product: Tables<'items'> }) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Image
        source="https://picsum.photos/80/80"
        contentFit="cover"
        alt={`${product.itemName} thumbnail image`}
        style={{ flex: 1, aspectRatio: 1 / 1 }}
      />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    overflow: 'hidden',
    aspectRatio: 1 / 1,
  },
}));

export default ProductCardThumbnailImage;
