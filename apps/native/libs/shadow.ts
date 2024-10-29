import { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types';

export const ShadowPresets = {
  card: (theme: UnistylesTheme) => ({
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: theme.spacing.sm,
    shadowOffset: { width: theme.spacing.sm, height: theme.spacing.sm },
  }),
  down: (theme: UnistylesTheme) => ({
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: theme.spacing.sm,
    shadowOffset: { width: 0, height: theme.spacing.sm },
  }),
};
