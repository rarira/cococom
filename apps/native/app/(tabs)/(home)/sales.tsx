import { CategorySectors } from '@cococom/supabase/libs';
import { router, useLocalSearchParams } from 'expo-router';
import { ComponentType, useCallback, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Route, SceneMap, TabBar, TabView, TabViewProps } from 'react-native-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountList from '@/components/custom/list/discount';
import Chip from '@/components/ui/chip';
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

  const { styles, theme } = useStyles(stylesheet);

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

  const renderTabBar = useCallback<NonNullable<TabViewProps<Route>['renderTabBar']>>(
    props => {
      return (
        <TabBar
          {...props}
          indicatorContainerStyle={styles.tabBarIndicatorContainer}
          renderLabel={({ route, focused }) => (
            <Chip
              text={route.title!}
              style={styles.tabBarLabelContainer(focused)}
              textProps={{ style: styles.tabBarLabelText(focused) }}
            />
          )}
          scrollEnabled
          style={styles.tabBarContainer}
          tabStyle={styles.tabContainer}
          pressOpacity={0.5}
          bounces
          gap={theme.spacing.md}
          // NOTE: TabBar 컴포넌트 버그 이렇게 하거나 scrollToOffset 전에 setTimeout 설정 필요
          contentContainerStyle={{ width: undefined }}
        />
      );
    },
    [styles, theme],
  );

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
      renderTabBar={renderTabBar}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.lg,
  },
  tabContainer: { width: 'auto', padding: 0 },
  tabBarContainer: {
    backgroundColor: theme.colors.background,
  },
  tabBarIndicatorContainer: {
    display: 'none',
  },
  tabBarLabelContainer: (focused: boolean) => ({
    backgroundColor: focused ? theme.colors.tint : theme.colors.background,
    borderWidth: 0.5,
    borderColor: focused ? theme.colors.tint : theme.colors.typography,
    opacity: focused ? 1 : 0.5,
  }),
  tabBarLabelText: (focused: boolean) => ({
    color: focused ? theme.colors.background : theme.colors.typography,
    fontWeight: focused ? 'bold' : 'normal',
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.md,
  }),
}));
