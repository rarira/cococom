import {
  StatusBar as ExpoStatusBar,
  StatusBarProps as ExpoStatusBarProps,
  StatusBarStyle,
} from 'expo-status-bar';
import { memo } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

interface StatusBarProps extends Omit<ExpoStatusBarProps, 'style'> {}

const StatusBar = memo(function StatusBar(props: StatusBarProps) {
  const { theme } = useColorScheme();

  return <ExpoStatusBar style={theme as StatusBarStyle} {...props} />;
});

export default StatusBar;
