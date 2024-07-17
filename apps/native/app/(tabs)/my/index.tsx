import { Link } from 'expo-router';
import { useCallback } from 'react';
import { Button, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import useSession from '@/hooks/useSession';
import { supabase } from '@/libs/supabase';

export default function MyScreen() {
  const { styles } = useStyles(stylesheet);

  const session = useSession();

  const signOut = useCallback(async () => {
    await supabase.signOut();
  }, []);

  return (
    <View style={styles.container}>
      {!session ? (
        <View>
          <Text>Not logged in</Text>
          <Link href="/auth/signin">
            <Text>Sign In</Text>
          </Link>
        </View>
      ) : (
        <View>
          <Text>Logged in</Text>
          <Text>{session.user.user_metadata.nickname}</Text>
          <Button title="Sign out" onPress={signOut} />
        </View>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
}));
