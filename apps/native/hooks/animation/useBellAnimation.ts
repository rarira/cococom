import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type UseBellAnimationParams = {
  showAnimation: boolean;
  angle?: number;
  duration?: number;
};

export function useBellAnimation({
  showAnimation,
  angle = 30,
  duration = 300,
}: UseBellAnimationParams) {
  const rotation = useSharedValue<number>(0);

  useEffect(() => {
    if (showAnimation) {
      rotation.value = withRepeat(
        withSequence(withTiming(angle, { duration }), withTiming(-30, { duration })),
        0,
      );
    } else {
      rotation.value = 0;
    }
  }, [showAnimation, rotation, angle, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  }, [showAnimation]);

  return { animatedStyle };
}
