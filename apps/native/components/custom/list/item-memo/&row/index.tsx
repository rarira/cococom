import { Tables } from '@cococom/supabase/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useRef } from 'react';
import { View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton from '@/components/ui/button/icon';
import Text from '@/components/ui/text';
import { formatLongLocalizedDateTime } from '@/libs/date';
import { handleMutateOfDeleteMemo, queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';

interface ItemMemoListRowProps {
  memo: Tables<'memos'>;
}

const ACTION_BUTTON_WIDTH = 50;

const RightAction = memo(({ dragX, swipeableRef, memo }: any) => {
  const { theme, styles } = useStyles(stylesheet);

  const queryClient = useQueryClient();

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

  return (
    <Animated.View style={[styles.actionButtonContainer, animatedStyle]}>
      <IconButton
        onPress={() => {}}
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

const ItemMemoListRow = memo(function ItemMemoListRow({ memo }: ItemMemoListRowProps) {
  const { styles } = useStyles(stylesheet);
  const swipeableRow = useRef<SwipeableMethods>(null);

  const renderRightActions = useCallback(
    (
      _progress: any,
      translation: SharedValue<number>,
      swipeableRef: React.RefObject<SwipeableMethods>,
    ) => <RightAction dragX={translation} swipeableRef={swipeableRef} memo={memo} />,
    [memo],
  );

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(_, progress) => renderRightActions(_, progress, swipeableRow)}
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
    borderColor: `${theme.colors.shadow}33`,
    borderBottomWidth: 1,
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingVertical: theme.spacing.md,
  },
  timeText: {
    fontSize: theme.fontSize.sm,
    color: `${theme.colors.typography}99`,
  },
  contentText: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.typography,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionButton: (backgroundColor: string) => ({
    backgroundColor,
    width: ACTION_BUTTON_WIDTH,
    height: '100%',
    borderRadius: 0,
  }),
}));

export default ItemMemoListRow;