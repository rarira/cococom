import { memo, PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface CardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

function Card({ children, style }: CardProps) {
  const { styles } = useStyles(stylesheets);

  return <View style={[styles.container, style]}>{children}</View>;
}

const stylesheets = createStyleSheet(theme => ({
  container: {
    flex: 1,
    border: `1px solid ${theme.colors.typography}`,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.md,
  },
}));

export default memo(Card);
