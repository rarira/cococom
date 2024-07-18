import { Link } from 'expo-router';
import { useCallback } from 'react';
import { Button, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

export default function MyScreen() {
  const { styles } = useStyles(stylesheet);

  const { user, setUser } = useUserStore();

  const signOut = useCallback(async () => {
    await supabase.signOut();
    setUser(null);
  }, [setUser]);

  return (
    <View style={styles.container}>
      {!user ? (
        <View>
          <Text>Not logged in</Text>
          <Link href="/auth/signin">
            <Text>Sign In</Text>
          </Link>
        </View>
      ) : (
        <View>
          <Text>Logged in</Text>
          <Text>{user.user_metadata.nickname}</Text>
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
