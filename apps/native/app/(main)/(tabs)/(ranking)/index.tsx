import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Route, SceneMap, TabBar, TabBarItem, TabView, TabViewProps } from 'react-native-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountedRankingList from '@/components/custom/list/ranking/discounted';
import ScreenTitleText from '@/components/custom/text/screen-title';
import Chip from '@/components/ui/chip';
import Text from '@/components/ui/text';

const SecondRoute = () => <View style={{ flex: 1 }} />;

export default function RankingScreen() {
  const { styles } = useStyles(stylesheet);

  const { top } = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'discounted', title: '세일 상품' },
    { key: 'all', title: '모든 상품' },
  ]);

  const renderScene = useMemo(() => {
    return SceneMap({
      discounted: () => <DiscountedRankingList />,
      all: SecondRoute,
    });
  }, []);

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
          renderTabBarItem={props => <TabBarItem {...props} style={styles.tabBarItem} />} // scrollEnabled
          style={styles.tabBarContainer}
          pressOpacity={0.5}
          bounces
        />
      );
    },
    [styles],
  );

  return (
    <View style={styles.container(top)}>
      <View style={styles.header}>
        <ScreenTitleText style={styles.title}>Ranking Top 50</ScreenTitleText>
        <Text type="subtitle" style={styles.subTitle}>
          다양한 랭킹을 통해 상품들을 만나보세요
        </Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        sceneContainerStyle={styles.sceneContainer(tabBarHeight)}
      />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number) => ({
    flex: 1,
    paddingTop: topInset + theme.spacing.lg,
    paddingHorizontal: theme.screenHorizontalPadding - theme.spacing.md,
    backgroundColor: theme.colors.background,
  }),
  header: {
    paddingHorizontal: theme.spacing.md,
  },
  sceneContainer: (tabBarHeight: number) => ({
    flex: 1,
    paddingBottom: tabBarHeight,
    paddingHorizontal: theme.spacing.md,
  }),
  title: {
    marginBottom: theme.spacing.md,
  },
  subTitle: {
    marginBottom: theme.spacing.lg,
  },
  tabBarContainer: {
    backgroundColor: theme.colors.lightShadow,
    borderRadius: theme.borderRadius.lg,
  },
  tabBarItem: {
    alignItems: undefined,
    height: '100%',
    padding: theme.spacing.md,
  },
  tabBarIndicatorContainer: {
    display: 'none',
  },
  tabBarLabelContainer: (focused: boolean) => ({
    backgroundColor: focused ? 'white' : 'transparent',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: focused ? 'white' : 'transparent',
    borderRadius: theme.borderRadius.md,
    opacity: focused ? 1 : 0.5,
  }),
  tabBarLabelText: (focused: boolean) => ({
    color: focused ? 'black' : theme.colors.typography,
    fontWeight: focused ? 'bold' : 'normal',
    fontSize: theme.fontSize.normal,
    lineHeight: theme.fontSize.md * 1.5,
  }),
}));
