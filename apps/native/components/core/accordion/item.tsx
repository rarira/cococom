import { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  withTiming,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface AccordionItemProps {
  isExpanded: SharedValue<boolean>;
  children: React.ReactNode;
  viewKey: string;
  style?: ViewStyle;
  duration?: number;
}

const AccordionItem = memo(function AccordionItem({
  isExpanded,
  children,
  viewKey,
  style,
  duration = 500,
}: AccordionItemProps) {
  const { styles } = useStyles(stylesheet);

  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View key={`accordionItem_${viewKey}`} style={[styles.animatedView, bodyStyle]}>
      <View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[styles.wrapper, style]}
      >
        {children}
      </View>
    </Animated.View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
}));

export default AccordionItem;
