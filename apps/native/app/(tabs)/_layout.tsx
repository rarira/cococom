import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React, { ComponentProps } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { TabBarIcon } from '@/components/custom/navigation/TabBarIcon';

export const unstable_settings = {
  initialRouteName: 'home',
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
  search: {
    focusedIcon: 'search',
    unfocusedIcon: 'search-outline',
  },
  ranking: {
    focusedIcon: 'star',
    unfocusedIcon: 'star-outline',
  },
  'my/index': {
    focusedIcon: 'person-circle',
    unfocusedIcon: 'person-circle-outline',
  },
};

export default function TabLayout() {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.tint,
        headerShown: false,
        tabBarStyle: styles.container,
        freezeOnBlur: true,
        tabBarIcon: ({ color, focused }) => {
          console.log(route.name);
          return (
            <TabBarIcon
              name={focused ? TabIcons[route.name].focusedIcon : TabIcons[route.name].unfocusedIcon}
              color={color}
              size={22}
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
        }}
      />
      <Tabs.Screen
        name="my/index"
        options={{
          title: 'My',
        }}
      />
    </Tabs>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    position: 'absolute',
    backgroundColor: theme.colors.background,
  },
}));
