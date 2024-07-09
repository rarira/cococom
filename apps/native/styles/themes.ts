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
  fontSize: {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 32,
  },
} as const;

export const lightTheme = {
  colors: {
    typography: '#000000',
    background: '#ffffff',
    link: '#0a7ea4',
    shadow: '#AAAAAA',
  },
  ...commonTheme,
} as const;

export const darkTheme = {
  colors: {
    typography: '#ffffff',
    background: '#000000',
    link: '#0a7ea4',
    shadow: '#333333',
  },
  ...commonTheme,
} as const;
