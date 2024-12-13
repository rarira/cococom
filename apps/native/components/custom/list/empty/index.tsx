import { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';

interface EmptyListProps {
  text: string;
  style?: ViewStyle;
}

const EmptyList = memo(function EmptyList({ text, style }: EmptyListProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: theme.fontSize.normal,
    color: theme.colors.alert,
  },
}));

export default EmptyList;
