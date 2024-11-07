import { memo, useCallback, useMemo, useState } from 'react';
import { Route, SceneMap, TabBar, TabBarItem, TabView, TabViewProps } from 'react-native-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Chip from '@/components/core/chip';
import MyCommentTabView from '@/components/custom/tab-view/my/comment';
import MyMemoTabView from '@/components/custom/tab-view/my/memo';
import MyWishlistTabView from '@/components/custom/tab-view/my/wishlist';

const AuthedMyContentView = memo(function AuthedMyContentView() {
  const { styles } = useStyles(stylesheet);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'wishlist', title: '관심 상품' },
    { key: 'comment', title: '작성 댓글' },
    { key: 'memo', title: '상품 메모' },
  ]);

  const renderScene = useMemo(() => {
    return SceneMap({
      wishlist: () => <MyWishlistTabView />,
      comment: () => <MyCommentTabView />,
      memo: () => <MyMemoTabView />,
    });
  }, []);

  const renderTabBar = useCallback<NonNullable<TabViewProps<Route>['renderTabBar']>>(
    props => {
      return (
        <TabBar
          {...props}
          indicatorContainerStyle={styles.tabBarIndicatorContainer}
          renderTabBarItem={({ key, ...restProps }) => {
            return (
              <TabBarItem
                key={key}
                {...restProps}
                style={styles.tabBarItem}
                label={({ route, focused }) => (
                  <Chip
                    text={route.title!}
                    style={styles.tabBarLabelContainer(focused)}
                    textProps={{ style: styles.tabBarLabelText(focused) }}
                  />
                )}
              />
            );
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
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      commonOptions={{ sceneStyle: styles.sceneContainer }}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  sceneContainer: {
    flex: 1,
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

export default AuthedMyContentView;
