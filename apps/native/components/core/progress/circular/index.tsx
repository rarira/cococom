import { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { Circle } from 'react-native-animated-spinkit';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface CircularProgressProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const CircularProgress = memo(function CircularProgress({
  size,
  color,
  style,
}: CircularProgressProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={[styles.container, style]}>
      <Circle color={color || theme.colors.tint} size={size || theme.fontSize.xl} />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default CircularProgress;
