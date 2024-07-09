const commonTheme = {
  spacing: {
    sm: 4,
    md: 6,
    lg: 12,
    xl: 16,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
} as const;

export const lightTheme = {
  colors: {
    typography: '#000000',
    background: '#ffffff',
    shadow: '#AAAAAA',
  },
  ...commonTheme,
} as const;

export const darkTheme = {
  colors: {
    typography: '#ffffff',
    background: '#000000',
    shadow: '#333333',
  },
  ...commonTheme,
} as const;
