import { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface LinearProgressProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const LinearProgress = memo(function LinearProgress({ size, color, style }: LinearProgressProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={[styles.container, style]}>
      <Flow color={color || theme.colors.tint} size={size || theme.fontSize.xl} />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default LinearProgress;
