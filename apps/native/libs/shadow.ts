import { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types';

export const shadowPresets = {
  card: (theme: UnistylesTheme) => ({
    offset: [theme.spacing.sm / 2, theme.spacing.sm / 2] as [x: number, y: number],
    startColor: `${theme.colors.shadow}22`,
    distance: theme.spacing.sm,
    sides: { start: false, top: false, bottom: true, end: true },
    corners: { topStart: false, topEnd: true, bottomStart: true, bottomEnd: true },
  }),
};
