import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React, { ComponentProps } from 'react';
import Animated, { LinearTransition, ReduceMotion } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { TabBarIcon } from '@/components/custom/navigation/TabBarIcon';
import { useUIStore } from '@/store/ui';

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

  const { tabBarVisible } = useUIStore();

  return (
    <Tabs
      screenOptions={({ route }) => {
        return {
          tabBarActiveTintColor: theme.colors.tint,
          headerShown: false,
          // tabBarStyle: styles.tabBar,
          freezeOnBlur: true,

          tabBarIcon: ({ color, focused }) => {
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
        };
      }}
      tabBar={props => {
        return (
          <Animated.View
            style={{
              height: tabBarVisible ? 'auto' : 0,
              position: 'absolute',
              backgroundColor: theme.colors.background,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            layout={LinearTransition.duration(100).delay(0).reduceMotion(ReduceMotion.Never)}
          >
            <BottomTabBar {...props} />
          </Animated.View>
        );
      }}
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
  tabBar: {
    position: 'absolute',
    backgroundColor: theme.colors.background,
  },
}));
