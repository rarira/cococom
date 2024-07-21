import { CategorySectors } from '@cococom/supabase/libs';
import { router, useLocalSearchParams } from 'expo-router';
import { ComponentType, useCallback, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountList from '@/components/custom/list/discount';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { useCategorySectorsStore } from '@/store/category-sector';

export default function SalesScreen() {
  useHideTabBar();

  const { categorySectorsArray } = useCategorySectorsStore();
  const { categorySector: categorySectorParam } = useLocalSearchParams<{
    categorySector: CategorySectors;
  }>();

  const [index, setIndex] = useState(() =>
    !categorySectorsArray || !categorySectorParam
      ? 0
      : categorySectorsArray.indexOf(categorySectorParam),
  );

  const [routes] = useState(() =>
    !categorySectorsArray
      ? []
      : categorySectorsArray.map(categorySector => ({
          key: categorySector,
          title: categorySector,
        })),
  );

  const { styles } = useStyles(stylesheet);

  const layout = useWindowDimensions();

  const renderScene = useMemo(() => {
    if (!categorySectorsArray) return SceneMap({});
    const routeComponentArray = categorySectorsArray.map(categorySector => {
      const Component = () => <DiscountList key={categorySector} categorySector={categorySector} />;
      Component.displayName = `DiscountList${categorySector}`;
      return Component;
    });

    const sceneMap = categorySectorsArray.reduce(
      (acc, categorySector, index) => {
        acc[categorySector] = routeComponentArray[index] as unknown as ComponentType<unknown>;
        return acc;
      },
      {} as Record<CategorySectors, ComponentType<unknown>>,
    );
    return SceneMap(sceneMap);
  }, [categorySectorsArray]);

  const handleIndexChange = useCallback(
    (index: number) => {
      setIndex(index);
      router.setParams({ categorySector: routes[index].key });
    },
    [routes],
  );

  return (
    <TabView
      lazy
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={handleIndexChange}
      initialLayout={{ width: layout.width }}
      style={styles.container}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.lg,
  },
}));
