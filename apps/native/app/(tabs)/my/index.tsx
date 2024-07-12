import { Link } from 'expo-router';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import useSession from '@/hooks/useSession';

export default function MyScreen() {
  const { styles } = useStyles(stylesheet);

  const session = useSession();

  return (
    <View style={styles.container}>
      {!session && (
        <View>
          <Text>Not logged in</Text>
          <Link href="/auth-modal/signin">Sign In</Link>
        </View>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
}));
