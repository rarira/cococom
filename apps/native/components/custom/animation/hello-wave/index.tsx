import { memo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';

const HellowWave = memo(function HelloWave() {
  const { styles } = useStyles(stylesheet);
  const rotationAnimation = useSharedValue(0);

  rotationAnimation.value = withRepeat(
    withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
    4, // Run the animation 4 times
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={styles.text}>👋</Text>
    </Animated.View>
  );
});

export default HellowWave;

const stylesheet = createStyleSheet(theme => ({
  text: {
    fontSize: theme.fontSize.xl,
    lineHeight: theme.fontSize.xl * 1.5,
    marginTop: -theme.spacing.md,
  },
}));
