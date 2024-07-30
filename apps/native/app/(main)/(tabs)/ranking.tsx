import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';

export default function RankingScreen() {
  const { styles } = useStyles(stylesheet);

  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.container(top)}>
      <Text>Rankings</Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number) => ({
    flex: 1,
    paddingTop: topInset,
    paddingHorizontal: theme.screenHorizontalPadding,
    backgroundColor: theme.colors.background,
  }),
}));
