import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { createStyleSheet } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import { useHideTabBar } from '@/hooks/useHideTabBar';

export default function ItemScreen() {
  const { itemId } = useLocalSearchParams();

  const navigation = useNavigation();

  useHideTabBar();

  console.log(navigation.canGoBack());
  useLayoutEffect(() => {
    console.log('itemId', navigation, router);
    navigation.setOptions({
      title: `Item: ${itemId}`,
      headerBackTitleVisible: false,
      headerShown: true,

      // HeaderBackButton: true,
    });
    // return () => {
    //   navigation.setOptions({});
    // };
  }, [navigation, itemId]);

  return (
    <View style={stylesheet.container}>
      <Text style={stylesheet.text}>Item: {itemId}</Text>
    </View>
  );
}

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
