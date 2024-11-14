import { createContext, memo, useContext } from 'react';
import { View, ViewProps } from 'react-native';
import { runOnJS, SharedValue, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { NullableNumber } from '@/libs/type';
import { getInitialPositions, ItemPositions } from '@/libs/draggable-list';

type DraggableListContextType = {
  currentItemPositions: SharedValue<ItemPositions>;
  isDragging: SharedValue<0 | 1>;
  draggedItemId: SharedValue<NullableNumber>;
  itemHeight: number;
  minBoundary: number;
  maxBoundary: number;
};

const DraggableListContext = createContext<DraggableListContextType | null>(null);

export function useDraggableListContext() {
  const context = useContext(DraggableListContext);
  if (!context) {
    throw new Error(
      'DraggableListItemcomponents cannot be rendered outside the DraggableListContext',
    );
  }

  return context;
}

type DraggableListProps = ViewProps & {
  items: { id: number }[];
  itemHeight: number;
  onDragEnd: (itemPositions: ItemPositions) => void;
};

function DraggableList({ items, itemHeight, onDragEnd, ...restProps }: DraggableListProps) {
  const currentItemPositions = useSharedValue<ItemPositions>(
    getInitialPositions(items, itemHeight),
  );

  //used to know if drag is happening or not
  const isDragging = useSharedValue<0 | 1>(0);

  //this will hold id for item which user started dragging
  const draggedItemId = useSharedValue<NullableNumber>(null);

  useAnimatedReaction(
    () => {
      return currentItemPositions.value;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        // do something ✨
        runOnJS(onDragEnd)(currentValue);
      }
    },
  );

  return (
    <DraggableListContext.Provider
      value={{
        currentItemPositions,
        isDragging,
        draggedItemId,
        itemHeight,
        minBoundary: 0,
        maxBoundary: (items.length - 1) * itemHeight,
      }}
    >
      <View {...restProps} />
    </DraggableListContext.Provider>
  );
}

export default memo(DraggableList);
