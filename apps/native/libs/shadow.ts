import { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types';

// boxShadow 객체를 문자열로 변환하는 유틸리티 함수
const convertBoxShadowToString = (boxShadow: {
  color: string;
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
}) => {
  return `${boxShadow.offsetX}px ${boxShadow.offsetY}px ${boxShadow.blurRadius}px ${boxShadow.spreadRadius}px ${boxShadow.color}`;
};

export const ShadowPresets = {
  card: (theme: UnistylesTheme, color?: string) => ({
    boxShadow: convertBoxShadowToString({
      color: color ?? `${theme.colors.shadow}22`,
      offsetX: theme.spacing.sm / 2,
      offsetY: theme.spacing.sm / 2,
      blurRadius: theme.spacing.sm / 4,
      spreadRadius: theme.spacing.sm / 4,
    }),
  }),
  down: (theme: UnistylesTheme, color?: string) => ({
    boxShadow: convertBoxShadowToString({
      color: color ?? `${theme.colors.shadow}22`,
      offsetX: 0,
      offsetY: theme.spacing.sm / 2,
      blurRadius: theme.spacing.sm / 4,
      spreadRadius: theme.spacing.sm / 4,
    }),
  }),
};
