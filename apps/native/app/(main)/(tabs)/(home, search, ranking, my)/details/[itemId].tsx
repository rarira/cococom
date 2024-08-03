import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View } from 'react-native';
import { createStyleSheet } from 'react-native-unistyles';

import Text from '@/components/ui/text';

export default function ItemScreen() {
  const { itemId } = useLocalSearchParams();

  const navigation = useNavigation();

  console.log(navigation.canGoBack());
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: `Item: ${itemId}`,
  //     headerLeft: () => (
  //       <Pressable onPress={navigation.goBack}>
  //         <Text>Back</Text>
  //       </Pressable>
  //     ),
  //   });
  // }, [navigation, itemId]);

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
