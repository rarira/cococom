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
  colors: {
    link: '#0a7ea4',
    alert: '#ff0000',
    shadow: '#333333',
  },
} as const;

// https://colorhunt.co/palette/402e7a4c3bcf4b70f53dc2ec
export const lightTheme = {
  ...commonTheme,
  colors: {
    ...commonTheme.colors,
    typography: '#11181C',
    background: '#ffffff',
    tint: '#402E7A',
    tint2: '#4C3BCF',
    tint3: '#4B70F5',
  },
} as const;

// https://colorhunt.co/palette/ffe9d0fffed3bbe9ffb1afff
export const darkTheme = {
  ...commonTheme,
  colors: {
    ...commonTheme.colors,
    typography: '#ECEDEE',
    background: '#121212',
    tint: '#FFE9D0',
    tint2: '#FFFED3',
    tint3: '#BBE9FF',
  },
} as const;

// https://m2.material.io/design/color/dark-theme.html