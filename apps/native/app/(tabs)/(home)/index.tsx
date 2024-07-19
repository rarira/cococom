import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CategorySectorList from '@/components/custom/list/category-sector';

export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container(tabBarHeight)}>
      <CategorySectorList />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (tabBarHeight: number) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: tabBarHeight + theme.spacing.lg,
  }),
}));
