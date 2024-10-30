import { memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Route, SceneMap, TabBar, TabBarItem, TabView, TabViewProps } from 'react-native-tab-view';
import { useStyles } from 'react-native-unistyles';

import Chip from '@/components/core/chip';
import MyWishlistTabView from '@/components/custom/tab-view/my/wishlist';

interface AuthedMyContentViewProps {}

const AuthedMyContentView = memo(function AuthedMyContentView({}: AuthedMyContentViewProps) {
  const { styles } = useStyles(stylesheet);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'wishlist', title: '관심 상품' },
    { key: 'comment', title: '댓글' },
    { key: 'memo', title: '메모' },
  ]);

  const renderScene = useMemo(() => {
    return SceneMap({
      wishlist: () => <MyWishlistTabView />,
      comment: () => <View />,
      memo: () => <View />,
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
          }} // scrollEnabled
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
      sceneContainerStyle={styles.sceneContainer}
    />
  );
});

export default AuthedMyContentView;
