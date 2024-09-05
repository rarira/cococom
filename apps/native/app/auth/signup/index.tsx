import { router } from 'expo-router';
import { View } from 'react-native';

export default function SignUpScreen() {
  console.log('signup screen', router.canGoBack());
  return <View />;
}
