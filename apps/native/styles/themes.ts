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
    xxs: 10,
    xs: 12,
    sm: 14,
    normal: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  colors: {
    link: '#0a7ea4',
    alert: '#E32A36',
    graphStroke: '#8641f4',
    tint3: '#0060A9',
  },
  screenHorizontalPadding: 16,
} as const;

// https://colorhunt.co/palette/402e7a4c3bcf4b70f53dc2ec
export const lightTheme = {
  ...commonTheme,
  colors: {
    ...commonTheme.colors,
    typography: '#11181C',
    background: '#F8F8F8',
    cardBackground: '#FFFFFF',
    modalBackground: '#FFFFFF',
    tint: '#402E7A',
    tint2: '#4C3BCF',
    shadow: '#888888',
    lightShadow: '#DDDDDD',
    scrim: 'rgba(0, 0, 0, 0.5)',
    darkBackground: '#11181C',
    googleBackground: '#FFFFFF',
    appleBackground: '#000000',
  },
} as const;

// https://colorhunt.co/palette/ffe9d0fffed3bbe9ffb1afff
export const darkTheme = {
  ...commonTheme,
  colors: {
    ...commonTheme.colors,
    typography: '#ECEDEE',
    background: '#000000',
    cardBackground: '#121212',
    modalBackground: '#232323',
    tint: '#FFE9D0',
    tint2: '#FFFED3',
    shadow: '#333333',
    lightShadow: '#555555',
    scrim: 'rgba(26,26,26, 0.6)',
    googleBackground: '#131314',
    appleBackground: '#FFFFFF',
  },
} as const;

// https://m2.material.io/design/color/dark-theme.html
