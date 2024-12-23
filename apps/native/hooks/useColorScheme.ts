import { useCallback, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { UnistylesRuntime, UnistylesThemes } from 'react-native-unistyles';
import { useMMKVString } from 'react-native-mmkv';

import { STORAGE_KEYS } from '@/libs/mmkv';

export function useColorScheme(loadOnly?: boolean) {
  const [theme, setTheme] = useMMKVString(STORAGE_KEYS.COLOR_SCHEME);

  const handleToggleAutoTheme = useCallback(() => {
    const newTheme =
      theme === 'auto' ? (UnistylesRuntime.colorScheme as keyof UnistylesThemes) : 'auto';
    setTheme(newTheme as string);
    UnistylesRuntime.setTheme(
      (newTheme === 'auto' ? UnistylesRuntime.colorScheme : newTheme) as keyof UnistylesThemes,
    );
  }, [setTheme, theme]);

  const handleToggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    UnistylesRuntime.setTheme(newTheme as keyof UnistylesThemes);
  }, [setTheme, theme]);

  useEffect(() => {
    if (!loadOnly) return;
    UnistylesRuntime.setTheme(
      (theme === 'auto' || !theme ? UnistylesRuntime.colorScheme : theme) as keyof UnistylesThemes,
    );
    if (!theme) setTheme('auto');
  }, [theme, loadOnly, setTheme]);

  useEffect(() => {
    if (!loadOnly) return;

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'auto' || !theme)
        UnistylesRuntime.setTheme(colorScheme as keyof UnistylesThemes);
      if (!theme) setTheme('auto');
    });
    return () => {
      listener.remove();
    };
  }, [loadOnly, setTheme, theme]);

  return {
    handleToggleAutoTheme,
    handleToggleTheme,
    theme,
    currentScheme: (theme === 'auto'
      ? UnistylesRuntime.colorScheme
      : theme) as NonNullable<ColorSchemeName>,
  };
}
