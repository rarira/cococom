import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

function Card({ children, style }: { children: ReactNode; style?: ViewStyle }): JSX.Element {
  const { styles } = useStyles(stylesheets);

  return <View style={[styles.container, style]}>{children}</View>;
}

const stylesheets = createStyleSheet(theme => ({
  container: {
    flex: 1,
    border: `1px solid ${theme.colors.typography}`,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}));

export default Card;
