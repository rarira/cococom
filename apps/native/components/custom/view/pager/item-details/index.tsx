import { Tables } from '@cococom/supabase/types';
import { Image } from 'expo-image';
import { memo } from 'react';
import { View } from 'react-native';
import { useCurrentTabScrollY } from 'react-native-collapsible-tab-view';
import PagerView from 'react-native-pager-view';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';

interface ItemDetailsPagerViewProps {
  onScrollY: (value: boolean) => void;
  item?: Tables<'items'>;
}

const ItemDetailsPagerView = memo(function ItemDetailsPagerView({
  onScrollY,
  item,
}: ItemDetailsPagerViewProps) {
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
      <PagerView
        style={styles.container}
        initialPage={0}
        useNext={false}
        scrollEnabled
        orientation="horizontal"
      >
        <View style={styles.page} key="1" collapsable={false}>
          <Image source={`https://picsum.photos/500/500`} style={styles.image} />
        </View>
        <View style={styles.page} key="2" collapsable={false}>
          <Text>Second page</Text>
        </View>
        <View style={styles.page} key="3" collapsable={false}>
          <Text>Third page</Text>
        </View>
      </PagerView>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    aspectRatio: 3 / 2,
  },
  page: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    objectFit: 'cover',
  },
}));

export default ItemDetailsPagerView;
