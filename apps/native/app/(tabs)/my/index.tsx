import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import useSession from '@/hooks/useSession';

export default function MyScreen() {
  const { styles } = useStyles(stylesheet);

  const session = useSession();

  console.log({ session });
  return (
    <View style={styles.container}>
      <Text>{typeof session}</Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
}));
