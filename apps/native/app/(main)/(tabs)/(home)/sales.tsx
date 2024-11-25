import { CategorySectors } from '@cococom/supabase/types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { ComponentType, useCallback, useMemo, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Route, SceneMap, TabBar, TabBarItem, TabBarProps, TabView } from 'react-native-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Chip from '@/components/core/chip';
import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import DiscountChannelRotateButton from '@/components/custom/button/discount-channel-rotate';
import HeaderRightButton from '@/components/custom/button/header/right';
import DiscountList from '@/components/custom/list/discount';
import { DiscountChannels } from '@/constants';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { useDiscountsSort } from '@/hooks/discount/useDiscountsSort';
import { useTransparentHeader } from '@/hooks/useTransparentHeader';
import { DISCOUNT_SORT_OPTIONS } from '@/libs/sort';
import { useCategorySectorsStore } from '@/store/category-sector';

export default function SalesScreen() {
  const categorySectorsArray = useCategorySectorsStore(state => state.categorySectorsArray);
  const { categorySector: categorySectorParam } = useLocalSearchParams<{
    categorySector: CategorySectors;
  }>();

  const [index, setIndex] = useState(() =>
    !categorySectorsArray || !categorySectorParam
      ? 0
      : categorySectorsArray.indexOf(categorySectorParam),
  );

  const routes = useMemo(
    () =>
      !categorySectorsArray
        ? []
        : categorySectorsArray.map(categorySector => ({
            key: categorySector,
            title: categorySector,
          })),
    [categorySectorsArray],
  );

  const { styles, theme } = useStyles(stylesheet);

  const layout = useWindowDimensions();

  useTransparentHeader({
    title: categorySectorParam,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { sort, sortOption, handleSortChange } = useDiscountsSort(DISCOUNT_SORT_OPTIONS, _sort =>
    bottomSheetModalRef.current?.dismiss(),
  );

  const { handlePress: handleChannelPress, option: channelOption } =
    useDiscountRotateButton<DiscountChannels>();

  const renderHeaderRightButton = useCallback(
    () => (
      <View style={styles.headerRightButtonContainer}>
        <HeaderRightButton
          iconProps={{ font: { type: 'MaterialIcon', name: 'sort' } }}
          onPress={() => bottomSheetModalRef.current?.present()}
          style={styles.sortButton}
        />
        <DiscountChannelRotateButton onPress={handleChannelPress} channelOption={channelOption} />
      </View>
    ),
    [channelOption, handleChannelPress, styles.headerRightButtonContainer, styles.sortButton],
  );

  const renderScene = useMemo(() => {
    if (!categorySectorsArray) return SceneMap({});
    const routeComponentArray = categorySectorsArray.map(categorySector => {
      const Component = () => (
        <DiscountList key={categorySector} sortOption={sortOption} channel={channelOption.value} />
      );
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
  }, [categorySectorsArray, channelOption.value, sortOption]);

  const renderTabBar = useCallback(
    (props: TabBarProps<Route>) => (
      <TabBar
        {...props}
        indicatorContainerStyle={styles.tabBarIndicatorContainer}
        scrollEnabled
        style={styles.tabBarContainer}
        tabStyle={styles.tabContainer}
        pressOpacity={0.5}
        bounces
        gap={theme.spacing.md}
        contentContainerStyle={styles.tabBarContentContainer}
        renderTabBarItem={({ key, ...restProps }) => (
          <TabBarItem
            key={key}
            {...restProps}
            label={({ route, focused }) => (
              <Chip
                text={route.title!}
                style={styles.tabBarLabelContainer(focused)}
                textProps={{ style: styles.tabBarLabelText(focused) }}
              />
            )}
          />
        )}
      />
    ),
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
    <View style={styles.container}>
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
      <SortBottomSheet
        sortOptions={DISCOUNT_SORT_OPTIONS}
        ref={bottomSheetModalRef}
        currentSort={sort}
        onSortChange={handleSortChange}
      />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerRightButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 0,
  },
  sortButton: {
    marginLeft: 0,
  },
  tabViewContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: { width: 'auto', padding: 0 },
  tabBarContainer: {
    backgroundColor: theme.colors.background,
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
    fontWeight: focused ? 'semibold' : 'normal',
    fontSize: theme.fontSize.normal,
    lineHeight: theme.fontSize.md,
  }),
}));
