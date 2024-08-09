import { memo, useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { TextProps } from '@/components/ui/text';

interface LongTextAnimationProps {
  containerWidth: number;
  text: string;
  style?: TextProps['style'];
}

const LongTextAnimation = memo(function LongTextAnimation({
  text,
  containerWidth,
  style,
}: LongTextAnimationProps) {
  const { styles } = useStyles(stylesheet);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const scrollText = () => {
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });

      Animated.timing(scrollX, {
        toValue: 1,
        duration: text.length * 300, // Duration based on text length
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        console.log('scrollText');
        scrollText();
      });
    };

    scrollText();
  }, [scrollX, text.length]);

  return (
    <View style={styles.container(containerWidth)}>
      <Animated.Text
        style={[
          styles.text,
          {
            transform: [
              {
                translateX: scrollX.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -containerWidth], // Translate from 0 to -screenWidth
                }),
              },
            ],
          },
          style,
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
export default LongTextAnimation;
