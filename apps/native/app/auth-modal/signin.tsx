import { Link, router } from 'expo-router';
import { View } from 'react-native';

import Text from '@/components/ui/text';

export default function SignInScreen() {
  const isPresented = router.canGoBack();

  console.log({ isPresented });

  return (
    <View>
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Text>Sign in</Text>
    </View>
  );
}
