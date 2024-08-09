import { JoinedItems } from '@cococom/supabase/types';
import { Image } from 'expo-image';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useCurrentTabScrollY } from 'react-native-collapsible-tab-view';
import PagerView from 'react-native-pager-view';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { usePagerViewNavigation } from '@/hooks/usePagerViewNavigation';

import ItemDetailsPagerNavView from '../&nav';
import ItemDetailsPagerGraphPageView from '../&page/graph';

interface ItemDetailsPagerWrapperViewProps {
  onScrollY: (value: boolean) => void;
  item: JoinedItems;
}

const ItemDetailsPagerWrapperView = memo(function ItemDetailsPagerWrapperView({
  onScrollY,
  item,
}: ItemDetailsPagerWrapperViewProps) {
  const { styles } = useStyles(stylesheet);
  const scrollY = useCurrentTabScrollY();

  const { pagerViewRef, handlePageSelected, activePage, handleNavigateToPage } =
    usePagerViewNavigation();

  useAnimatedReaction(
    () => scrollY.value > 0,
    (currentValue, previousValue) => {
      if (previousValue !== null && currentValue !== previousValue) {
        runOnJS(onScrollY)(currentValue);
      }
    },
  );

  const GraphPages = useMemo(() => {
    const graphValueFieldArray =
      item.lowestPrice === 0 ? ['discount'] : ['discount', 'discountPrice', 'discountRate'];

    return graphValueFieldArray.map((valueField, index) => (
      <View style={styles.page} key={index + 1} collapsable={false}>
        <ItemDetailsPagerGraphPageView
          discountsData={item.discounts}
          valueField={valueField as any}
        />
      </View>
    ));
  }, [item.discounts, item.lowestPrice, styles.page]);

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerViewRef}
        style={styles.container}
        initialPage={0}
        useNext={false}
        scrollEnabled
        orientation="horizontal"
        onPageSelected={handlePageSelected}
      >
        <View style={styles.page} key="1" collapsable={false}>
          <Image source={`https://picsum.photos/500/500`} style={styles.image} />
        </View>
        {GraphPages}
      </PagerView>
      <ItemDetailsPagerNavView
        activePage={activePage}
        handleNavigateToPage={handleNavigateToPage}
        totalPages={GraphPages.length + 1}
      />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    aspectRatio: 3 / 2,
    backgroundColor: theme.colors.cardBackground,
    position: 'relative',
  },
  page: {
    width: '100%',
    height: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
    objectFit: 'cover',
  },
}));

export default ItemDetailsPagerWrapperView;
