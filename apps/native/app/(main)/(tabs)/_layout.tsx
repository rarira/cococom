import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React, { ComponentProps } from 'react';
import Animated, { LinearTransition, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TabBarIcon from '@/components/custom/navigation/tab-bar-icon';
import { useUiStore } from '@/store/ui';

export const unstable_settings = {
  initialRouteName: '(home)',
};

const TabIcons: Record<
  string,
  {
    focusedIcon: ComponentProps<typeof Ionicons>['name'];
    unfocusedIcon: ComponentProps<typeof Ionicons>['name'];
  }
> = {
  '(home)': {
    focusedIcon: 'home',
    unfocusedIcon: 'home-outline',
  },
  '(search)': {
    focusedIcon: 'search',
    unfocusedIcon: 'search-outline',
  },
  '(ranking)': {
    focusedIcon: 'star',
    unfocusedIcon: 'star-outline',
  },
  '(my)': {
    focusedIcon: 'person-circle',
    unfocusedIcon: 'person-circle-outline',
  },
};

export default function TabLayout() {
  const { styles, theme } = useStyles(stylesheet);

  const tabBarVisible = useUiStore(state => state.tabBarVisible);
  const { bottom } = useSafeAreaInsets();

  console.log('TabLayout', { tabBarVisible });
  return (
    <Tabs
      screenOptions={({ route }: { route: RouteProp<any, any> }) => {
        return {
          tabBarActiveTintColor: theme.colors.tint,
          headerShown: false,
          freezeOnBlur: true,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => {
            return (
              <TabBarIcon
                name={
                  focused ? TabIcons[route.name].focusedIcon : TabIcons[route.name].unfocusedIcon
                }
                color={color}
                size={22}
              />
            );
          },
          tabBarStyle: styles.tabBar(bottom),
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: styles.tabBarLabel,
        };
      }}
      tabBar={props => {
        return (
          <Animated.View
            style={styles.tabBarContainer(tabBarVisible)}
            layout={LinearTransition.duration(100).delay(0).reduceMotion(ReduceMotion.Never)}
          >
            <BottomTabBar {...props} style={{ paddingBottom: theme.spacing.lg }} />
          </Animated.View>
        );
      }}
      initialRouteName={unstable_settings.initialRouteName}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: '홈',
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          title: '검색',
        }}
      />
      <Tabs.Screen
        name="(ranking)"
        options={{
          title: '랭킹',
        }}
      />
      <Tabs.Screen
        name="(my)"
        options={{
          title: '마이',
        }}
      />
    </Tabs>
  );
}

const stylesheet = createStyleSheet(theme => ({
  tabBar: (bottom: number) => ({
    backgroundColor: theme.colors.cardBackground,
    height: 60 + bottom,
  }),
  tabBarContainer: (tabBarVisible: boolean) => ({
    flex: 1,
    height: tabBarVisible ? 'auto' : 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }),
  tabBarLabel: {
    fontSize: theme.fontSize.normal,
    fontWeight: 'bold',
  },
}));
