import { memo } from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

import { useDraggableList } from '@/hooks/useDraggableList';

type DraggableListItemProps = {
  item: { id: number };
  children: React.ReactNode;
  containerStyle: ViewStyle;
};

function DraggableListItem({ children, item, containerStyle }: DraggableListItemProps) {
  const { gesture, animatedStyles } = useDraggableList(item);
  return (
    <Animated.View style={[containerStyle, animatedStyles]}>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
    </Animated.View>
  );
}

export default memo(DraggableListItem);
