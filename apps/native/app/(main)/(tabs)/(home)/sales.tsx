import { CategorySectors } from '@cococom/supabase/libs';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { ComponentType, useCallback, useMemo, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Route, SceneMap, TabBar, TabView, TabViewProps } from 'react-native-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountSortBottomSheet from '@/components/custom/bottom-sheet/discount-sort';
import HeaderRightButton from '@/components/custom/button/header-right';
import DiscountList from '@/components/custom/list/discount';
import Chip from '@/components/ui/chip';
import { useDiscountsSort } from '@/hooks/useDiscountsSort';
import { useCategorySectorsStore } from '@/store/category-sector';

export default function SalesScreen() {
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

  const { bottom: bottomInset } = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { sort, handleSortChange } = useDiscountsSort(_sort =>
    bottomSheetModalRef.current?.dismiss(),
  );

  const renderHeaderRightButton = useCallback(
    () => (
      <HeaderRightButton
        iconProps={{ font: { type: 'MaterialIcon', name: 'sort' } }}
        onPress={() => bottomSheetModalRef.current?.present()}
      />
    ),
    [],
  );

  const renderScene = useMemo(() => {
    if (!categorySectorsArray) return SceneMap({});
    const routeComponentArray = categorySectorsArray.map(categorySector => {
      const Component = () => <DiscountList key={categorySector} currentSort={sort} />;
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
  }, [categorySectorsArray, sort]);

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
          // NOTE: TabBar 컴포넌트 버그 이렇게 하거나 scrollToOffset을 requestAnimationFrame적용 필요
          contentContainerStyle={styles.tabBarContentContainer}
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
    <View style={styles.container(bottomInset)}>
      <Stack.Screen options={{ headerRight: renderHeaderRightButton }} />
      <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={{ width: layout.width }}
        style={styles.tabViewContainer}
        renderTabBar={renderTabBar}
      />
      <DiscountSortBottomSheet
        ref={bottomSheetModalRef}
        currentSort={sort}
        onSortChange={handleSortChange}
      />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (bottomInset: number) => ({
    flex: 1,
    paddingBottom: bottomInset,
    backgroundColor: theme.colors.background,
  }),
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tabViewContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.lg,
  },
  tabContainer: { width: 'auto', padding: 0 },
  tabBarContainer: {
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.md,
  },
  tabBarContentContainer: {
    width: undefined,
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
