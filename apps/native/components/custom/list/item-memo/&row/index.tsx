import { Tables } from '@cococom/supabase/types';
import { memo, useCallback, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';

interface ItemMemoListRowProps {
  memo: Tables<'memos'>;
}

const RightAction = ({ dragX, swipeableRef }: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: dragX.value + 54,
        },
      ],
    };
  });

  const handlePress = useCallback(() => {
    console.log(swipeableRef.current);
    swipeableRef.current?.close();
  }, [swipeableRef]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#497AFC',
          justifyContent: 'center',
        },
        animatedStyle,
      ]}
    >
      <Pressable onPress={handlePress}>
        <Text>Archive</Text>
      </Pressable>
    </Animated.View>
  );
};

const ItemMemoListRow = memo(function ItemMemoListRow({ memo }: ItemMemoListRowProps) {
  const { styles } = useStyles(stylesheet);
  const swipeableRow = useRef<SwipeableMethods>(null);

  const renderRightActions = (
    _progress: any,
    translation: SharedValue<number>,
    swipeableRef: React.RefObject<SwipeableMethods>,
  ) => <RightAction dragX={translation} swipeableRef={swipeableRef} />;

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(_, progress) => renderRightActions(_, progress, swipeableRow)}
    >
      <View style={styles.container}>
        <Text>{memo.content}</Text>
      </View>
    </Swipeable>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    width: '100%',
    borderColor: theme.colors.shadow,
    borderWidth: 1,
  },
}));

export default ItemMemoListRow;
