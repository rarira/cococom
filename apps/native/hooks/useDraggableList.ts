import { Gesture } from 'react-native-gesture-handler';
import {
  withSpring,
  withDelay,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

import { NullableNumber } from '@/libs/type';
import { useDraggableListContext } from '@/components/core/draggable-list';
import { getKeyOfValue } from '@/libs/draggable-list';

export function useDraggableList(item: { id: number }) {
  const { itemHeight, currentItemPositions, isDragging, draggedItemId, maxBoundary, minBoundary } =
    useDraggableListContext();

  const currentItemPositionDerived = useDerivedValue(() => {
    return currentItemPositions.value;
  });

  const top = useSharedValue(currentItemPositionDerived.value[item.id].updatedIndex * itemHeight);

  const isDraggingDerived = useDerivedValue(() => {
    return isDragging.value;
  });

  const draggedItemIdDerived = useDerivedValue(() => {
    return draggedItemId.value;
  });

  const isCurrentDraggingItem = useDerivedValue(() => {
    return isDraggingDerived.value && draggedItemIdDerived.value === item.id;
  });

  //used for swapping with currentIndex
  const newIndex = useSharedValue<NullableNumber>(null);

  //used for swapping with newIndex
  const currentIndex = useSharedValue<NullableNumber>(null);

  const gesture = Gesture.Pan()
    .onStart(() => {
      //start dragging
      isDragging.value = withSpring(1);

      //keep track of dragged item
      draggedItemId.value = item.id;

      //store dragged item id for future swap
      currentIndex.value = currentItemPositionDerived.value[item.id].updatedIndex;
    })
    .onUpdate(e => {
      if (draggedItemIdDerived.value === null) {
        return;
      }

      const newTop =
        currentItemPositionDerived.value[draggedItemIdDerived.value].updatedTop + e.translationY;

      if (newTop < minBoundary || newTop > maxBoundary) {
        //dragging out of bound
        return;
      }

      top.value = newTop;

      //calculate the new index where drag is headed to
      newIndex.value = Math.floor((newTop + itemHeight / 2) / itemHeight);

      //swap the items present at newIndex and currentIndex
      if (newIndex.value !== currentIndex.value) {
        //find id of the item that currently resides at newIndex
        const newIndexItemKey = getKeyOfValue(newIndex.value, currentItemPositionDerived.value);

        //find id of the item that currently resides at currentIndex
        const currentDragIndexItemKey = getKeyOfValue(
          currentIndex.value!,
          currentItemPositionDerived.value,
        );

        if (newIndexItemKey !== undefined && currentDragIndexItemKey !== undefined) {
          //we update updatedTop and updatedIndex as next time we want to do calculations from new top value and new index
          currentItemPositions.value = {
            ...currentItemPositionDerived.value,
            [newIndexItemKey]: {
              ...currentItemPositionDerived.value[newIndexItemKey],
              updatedIndex: currentIndex.value!,
              updatedTop: currentIndex.value! * itemHeight,
            },
            [currentDragIndexItemKey]: {
              ...currentItemPositionDerived.value[currentDragIndexItemKey],
              updatedIndex: newIndex.value,
            },
          };

          //update new index as current index
          currentIndex.value = newIndex.value;
        }
      }
    })
    .onEnd(() => {
      if (currentIndex.value === null || newIndex.value === null) {
        return;
      }

      top.value = withSpring(newIndex.value * itemHeight);

      //find original id of the item that currently resides at currentIndex
      const currentDragIndexItemKey = getKeyOfValue(
        currentIndex.value,
        currentItemPositionDerived.value,
      );

      if (currentDragIndexItemKey !== undefined) {
        //update the values for item whose drag we just stopped
        currentItemPositions.value = {
          ...currentItemPositionDerived.value,
          [currentDragIndexItemKey]: {
            ...currentItemPositionDerived.value[currentDragIndexItemKey],
            updatedTop: newIndex.value * itemHeight,
          },
        };
      }
      //stop dragging
      isDragging.value = withDelay(200, withSpring(0));
    });

  useAnimatedReaction(
    () => {
      return currentItemPositions.value[item.id].updatedIndex;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        top.value = currentItemPositions.value[item.id].updatedIndex * itemHeight;
      }
    },
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: top.value,
      transform: [
        {
          scale: isCurrentDraggingItem.value
            ? interpolate(isDraggingDerived.value, [0, 1], [1, 1.03])
            : interpolate(isDraggingDerived.value, [0, 1], [1, 0.98]),
        },
      ],
      elevation: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0, 5])
        : 0, // For Android,
      zIndex: isCurrentDraggingItem.value ? 1 : 0,
      opacity: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0.8, 1])
        : interpolate(isDraggingDerived.value, [0, 1], [0.8, 0.5]),
    };
  });

  return {
    gesture,
    animatedStyles,
  };
}
