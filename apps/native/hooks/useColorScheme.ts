import { useCallback, useEffect } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime, UnistylesThemes } from 'react-native-unistyles';
import { useMMKVString } from 'react-native-mmkv';

import { STORAGE_KEYS } from '@/libs/mmkv';

export function useColorScheme() {
  const [theme, setTheme] = useMMKVString(STORAGE_KEYS.COLOR_SCHEME);

  const handleToggleAutoTheme = useCallback(() => {
    setTheme(theme =>
      theme === 'auto' ? (UnistylesRuntime.colorScheme as keyof UnistylesThemes) : 'auto',
    );
    UnistylesRuntime.setTheme(UnistylesRuntime.colorScheme as keyof UnistylesThemes);
  }, [setTheme]);

  const handleToggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    UnistylesRuntime.setTheme(newTheme);
  }, [setTheme, theme]);

  useEffect(() => {
    if (theme !== 'auto') return;

    const currentTheme = Appearance.getColorScheme();
    if (currentTheme !== UnistylesRuntime.colorScheme) {
      UnistylesRuntime.setTheme(UnistylesRuntime.colorScheme as keyof UnistylesThemes);
    }

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      UnistylesRuntime.setTheme(colorScheme as keyof UnistylesThemes);
    });
    return () => {
      listener.remove();
    };
  }, [setTheme, theme]);

  return {
    handleToggleAutoTheme,
    handleToggleTheme,
    theme,
  };
}
