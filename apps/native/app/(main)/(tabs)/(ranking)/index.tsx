import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Route, SceneMap, TabBar, TabBarItem, TabView, TabViewProps } from 'react-native-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Chip from '@/components/core/chip';
import Text from '@/components/core/text';
import AlltimeRankingTabView from '@/components/custom/tab-view/ranking/alltime';
import DiscountedRankingTabView from '@/components/custom/tab-view/ranking/discounted';
import ScreenTitleText from '@/components/custom/text/screen-title';
import ScreenContainerView from '@/components/custom/view/container/screen';

export default function RankingScreen() {
  const { styles } = useStyles(stylesheet);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'discounted', title: '세일 상품' },
    { key: 'alltime', title: '모든 상품' },
  ]);

  const renderScene = useMemo(() => {
    return SceneMap({
      discounted: () => <DiscountedRankingTabView />,
      alltime: () => <AlltimeRankingTabView />,
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
          renderTabBarItem={props => {
            const { key, ...restProps } = props;
            return <TabBarItem key={key} {...restProps} style={styles.tabBarItem} />;
          }}
          style={styles.tabBarContainer}
          pressOpacity={0.5}
          bounces
        />
      );
    },
    [styles],
  );

  return (
    <ScreenContainerView style={styles.container}>
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
        sceneContainerStyle={styles.sceneContainer}
      />
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  sceneContainer: {
    flex: 1,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  subTitle: {
    marginBottom: theme.spacing.lg,
  },
  tabBarContainer: {
    backgroundColor: theme.colors.lightShadow,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.screenHorizontalPadding - theme.spacing.md,
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
