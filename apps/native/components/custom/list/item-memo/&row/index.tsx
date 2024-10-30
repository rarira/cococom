import { Tables } from '@cococom/supabase/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, MutableRefObject, useCallback } from 'react';
import { View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton from '@/components/core/button/icon';
import Text from '@/components/core/text';
import { useOnlyOneSwipeable } from '@/hooks/swipeable/useOnlyOneSwipeable';
import { formatLongLocalizedDateTime } from '@/libs/date';
import { handleMutateOfDeleteMemo, queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useMemoEditStore } from '@/store/memo-edit';

interface ItemMemoListRowProps {
  memo: Tables<'memos'>;
  previousSwipeableRef: MutableRefObject<SwipeableMethods | null>;
}

const ACTION_BUTTON_WIDTH = 50;

const RightAction = memo(({ dragX, swipeableRef, memo }: any) => {
  const { theme, styles } = useStyles(stylesheet);

  const queryClient = useQueryClient();

  const { bottomSheetRef, setMemo } = useMemoEditStore(store => ({
    setMemo: store.setMemo,
    bottomSheetRef: store.bottomSheetRef,
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: dragX.value + ACTION_BUTTON_WIDTH * 2,
        },
      ],
    };
  });

  const queryKey = queryKeys.memos.byItem(memo.itemId, memo.userId);

  const deleteMemoMutation = useMutation({
    mutationFn: () => supabase.deleteMemo(memo.id),
    onMutate: () => {
      return handleMutateOfDeleteMemo({
        queryClient,
        queryKey,
        memoId: memo.id,
        itemQueryKey: queryKeys.items.byId(memo.itemId, memo.userId),
      });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });

  const handleDeletePress = useCallback(async () => {
    try {
      await deleteMemoMutation.mutateAsync();
    } catch (e) {
      console.error(e);
    }
  }, [deleteMemoMutation]);

  const handleEditPress = useCallback(() => {
    setMemo(memo);
    bottomSheetRef.current?.present();
    swipeableRef.current?.close();
  }, [bottomSheetRef, memo, setMemo, swipeableRef]);

  return (
    <Animated.View style={[styles.actionButtonContainer, animatedStyle]}>
      <IconButton
        onPress={handleEditPress}
        iconProps={{
          font: { type: 'MaterialIcon', name: 'edit' },
          size: theme.fontSize.lg,
          color: 'white',
        }}
        style={styles.actionButton(theme.colors.tint3)}
      />
      <IconButton
        onPress={handleDeletePress}
        iconProps={{
          font: { type: 'FontAwesomeIcon', name: 'trash-o' },
          size: theme.fontSize.lg,
          color: 'white',
        }}
        style={styles.actionButton(theme.colors.alert)}
      />
    </Animated.View>
  );
});

RightAction.displayName = 'RightAction';

const ItemMemoListRow = memo(function ItemMemoListRow({
  memo,
  previousSwipeableRef,
}: ItemMemoListRowProps) {
  const { styles } = useStyles(stylesheet);

  const renderRightActions = useCallback(
    (
      _progress: any,
      translation: SharedValue<number>,
      swipeableRef: React.RefObject<SwipeableMethods>,
    ) => <RightAction dragX={translation} swipeableRef={swipeableRef} memo={memo} />,
    [memo],
  );

  const swipeableProps = useOnlyOneSwipeable(previousSwipeableRef);

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(_, progress) => renderRightActions(_, progress, swipeableProps.ref)}
      {...swipeableProps}
    >
      <View style={styles.container}>
        <Text style={styles.timeText}>
          {formatLongLocalizedDateTime(memo.updated_at || memo.created_at)}
        </Text>
        <Text style={styles.contentText}>{memo.content}</Text>
      </View>
    </Swipeable>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    flexDirection: 'column',
    paddingVertical: theme.spacing.md,
  },
  timeText: {
    fontSize: theme.fontSize.sm,
    color: `${theme.colors.typography}BB`,
  },
  contentText: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.typography,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
    width: ACTION_BUTTON_WIDTH * 2,
  },
  actionButton: (backgroundColor: string) => ({
    backgroundColor,
    width: ACTION_BUTTON_WIDTH,
    height: '100%',
    borderRadius: 0,
  }),
}));

export default ItemMemoListRow;
