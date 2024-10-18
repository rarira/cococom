import { useCallback, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime, UnistylesThemes } from 'react-native-unistyles';

import { storage, STORAGE_KEYS } from '@/libs/mmkv';

export function useColorScheme(loadOnly?: boolean) {
  const [theme, setTheme] = useState<keyof UnistylesThemes | null>(
    () => (storage.getString(STORAGE_KEYS.COLOR_SCHEME) as keyof UnistylesThemes) || null,
  );

  const handleToggleAutoTheme = useCallback(() => {
    setTheme(theme => {
      if (theme === null) {
        return 'dark';
      }
      return null;
    });
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme(theme => (theme === 'dark' ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    if (theme === null) {
      storage.delete(STORAGE_KEYS.COLOR_SCHEME);
      UnistylesRuntime.setTheme(UnistylesRuntime.colorScheme as keyof UnistylesThemes);
    } else {
      storage.set(STORAGE_KEYS.COLOR_SCHEME, theme);
      UnistylesRuntime.setTheme(theme);
    }
  }, [loadOnly, theme]);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme as keyof UnistylesThemes);
    });
    return () => {
      listener.remove();
    };
  }, []);

  return {
    handleToggleAutoTheme,
    handleToggleTheme,
    theme,
  };
}
