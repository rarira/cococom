import { StatusBar as ExpoStatusBar, StatusBarProps as ExpoStatusBarProps } from 'expo-status-bar';
import { memo } from 'react';

interface StatusBarProps extends ExpoStatusBarProps {}

const StatusBar = memo(function StatusBar(props: StatusBarProps) {
  return <ExpoStatusBar style="auto" {...props} />;
});

export default StatusBar;
