import { JoinedItems } from '@cococom/supabase/types';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { usePagerViewNavigation } from '@/hooks/usePagerViewNavigation';

import ItemDetailsPagerNavView from '../&nav';
import ItemDetailsPagerGraphPageView from '../&page/graph';
import ItemDetailsPagerImagePageView from '../&page/image';

interface ItemDetailsPagerWrapperViewProps {
  item: JoinedItems;
}

const ItemDetailsPagerWrapperView = memo(function ItemDetailsPagerWrapperView({
  item,
}: ItemDetailsPagerWrapperViewProps) {
  const { styles } = useStyles(stylesheet);

  const { pagerViewRef, handlePageSelected, activePage, handleNavigateToPage } =
    usePagerViewNavigation();

  const GraphPages = useMemo(() => {
    if (!item.discounts) return null;
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
        <ItemDetailsPagerImagePageView item={item} />
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
}));

export default ItemDetailsPagerWrapperView;
