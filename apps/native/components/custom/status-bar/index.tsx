import { StatusBar as ExpoStatusBar, StatusBarProps as ExpoStatusBarProps } from 'expo-status-bar';
import { memo } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

interface StatusBarProps extends Omit<ExpoStatusBarProps, 'style'> {}

const StatusBar = memo(function StatusBar(props: StatusBarProps) {
  const { currentScheme } = useColorScheme();

  return <ExpoStatusBar style={currentScheme === 'dark' ? 'light' : 'dark'} {...props} />;
});

export default StatusBar;
