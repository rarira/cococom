import { Tables } from '@cococom/supabase/types';
import { Image } from 'expo-image';
import { memo } from 'react';
import { View } from 'react-native';
import { useCurrentTabScrollY } from 'react-native-collapsible-tab-view';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface ItemDetailsHeaderProps {
  onScrollY: (value: boolean) => void;
  item?: Tables<'items'>;
}

const ItemDetailsHeader = memo(function ItemDetailsHeader({
  item,
  onScrollY,
}: ItemDetailsHeaderProps) {
  const { styles } = useStyles(stylesheet);

  const scrollY = useCurrentTabScrollY();

  useAnimatedReaction(
    () => scrollY.value > 0,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        // do something ✨
        runOnJS(onScrollY)(currentValue);
      }
    },
  );

  if (!item) return null;

  return (
    <View style={styles.container}>
      <Image source={`https://picsum.photos/500/500`} style={styles.image} />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 2,
    objectFit: 'cover',
  },
}));

export default ItemDetailsHeader;
