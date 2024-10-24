import { JoinedComments } from '@cococom/supabase/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, MutableRefObject, useCallback, useRef } from 'react';
import { View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton from '@/components/core/button/icon';
import Text from '@/components/core/text';
import { useOnlyOneSwipeable } from '@/hooks/useOnlyOneSwipeable';
import { formatLongLocalizedDateTime } from '@/libs/date';
import { handleMutateOfDeleteComment, queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

interface ItemCommentListRowProps {
  comment: JoinedComments;
}

const ACTION_BUTTON_WIDTH = 50;

const RightAction = memo(({ dragX, comment }: any) => {
  const { theme, styles } = useStyles(stylesheet);

  const user = useUserStore(store => store.user);
  const queryClient = useQueryClient();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: dragX.value + ACTION_BUTTON_WIDTH,
        },
      ],
    };
  });

  const queryKey = queryKeys.comments.byItem(comment.item_id);

  const deleteCommentMutation = useMutation({
    mutationFn: () => supabase.deleteComment(comment.id),
    onMutate: () => {
      return handleMutateOfDeleteComment({
        queryClient,
        queryKey,
        commentId: comment.id,
        itemQueryKey: queryKeys.items.byId(comment.item_id, user?.id),
      });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });

  const handleDeletePress = useCallback(async () => {
    try {
      await deleteCommentMutation.mutateAsync();
    } catch (e) {
      console.error(e);
    }
  }, [deleteCommentMutation]);

  return (
    <Animated.View style={[styles.actionButtonContainer, animatedStyle]}>
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

const ItemCommentListRow = memo(function ItemCommentListRow({ comment }: ItemCommentListRowProps) {
  const { styles } = useStyles(stylesheet);
  const user = useUserStore(store => store.user);
  const previousSwipeableRef = useRef<SwipeableMethods>(null);

  const renderRightActions = useCallback(
    (_progress: any, translation: SharedValue<number>) => (
      <RightAction dragX={translation} comment={comment} />
    ),
    [comment],
  );

  const swipeableProps = useOnlyOneSwipeable(
    previousSwipeableRef as MutableRefObject<SwipeableMethods>,
  );

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(_, progress) => renderRightActions(_, progress)}
      {...swipeableProps}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.authorText(comment.author.id === user?.id)}>
            {comment.author.nickname}
          </Text>
          <Text style={styles.timeText}>{formatLongLocalizedDateTime(comment.created_at)}</Text>
        </View>
        <Text style={styles.contentText}>{comment.content}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  authorText: (myself: boolean) => ({
    fontSize: theme.fontSize.normal,
    color: myself ? theme.colors.tint : `${theme.colors.typography}BB`,
  }),
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
    marginLeft: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
    width: ACTION_BUTTON_WIDTH,
  },
  actionButton: (backgroundColor: string) => ({
    backgroundColor,
    width: ACTION_BUTTON_WIDTH,
    height: '100%',
    borderRadius: 0,
  }),
}));

export default ItemCommentListRow;
