import { memo, useCallback } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Icon, { IconProps } from '../../icon';

interface ToggleSwitchProps extends PressableProps {
  checked: boolean;
  onToggle: () => void;
  checkedColor?: string;
  containerHeight?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const CheckboxIconFont = { type: 'FontAwesomeIcon', name: 'check' };

const ToggleSwitch = memo(function ToggleSwitch({
  checked,
  onToggle,
  checkedColor,
  containerHeight: _containerHeight,
  style,

  ...restProps
}: ToggleSwitchProps) {
  const { styles, theme } = useStyles(stylesheet);
  const checkedValue = useSharedValue(checked ? 1 : 0);

  const containerHeight = _containerHeight || theme.fontSize.xl;
  const containerWidth = containerHeight * 1.7;

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        checkedValue.value,
        [0, 1],
        [theme.colors.shadow, checkedColor || theme.colors.tint3],
      ),
    };
  });

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: checkedValue.value * (containerWidth - 2 - (containerHeight - 2)) },
      ],
    };
  });

  const handlePress = useCallback(
    (_event: any) => {
      onToggle();
      checkedValue.value = withTiming(checkedValue.value === 0 ? 1 : 0, { duration: 200 });
    },
    [checkedValue, onToggle],
  );

  return (
    <AnimatedPressable
      style={[animatedContainerStyle, styles.container(containerWidth, containerHeight), style]}
      onPress={handlePress}
      {...restProps}
    >
      <Animated.View style={[styles.circle, animatedCircleStyle]}>
        {checked ? (
          <Icon
            size={theme.fontSize.sm}
            color={theme.colors.tint3}
            font={CheckboxIconFont as IconProps['font']}
          />
        ) : null}
      </Animated.View>
    </AnimatedPressable>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: (width: number, height: number) => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
    width,
    height,
    borderRadius: 9999,
  }),
  circle: {
    aspectRatio: 1,
    height: '100%',
    borderRadius: 9999,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default ToggleSwitch;
