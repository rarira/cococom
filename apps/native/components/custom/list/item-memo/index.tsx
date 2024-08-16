import { User } from '@cococom/supabase/types';
import { memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';

interface ItemMemoListProps {
  user: User;
}

const ItemMemoList = memo(function ItemMemoList({ user }: ItemMemoListProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text>Item Memo List of ${user.id}</Text>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default ItemMemoList;
