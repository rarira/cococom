import { JoinedComments } from '@cococom/supabase/types';
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
import { handleMutateOfDeleteComment, queryKeys, updateMyCommentInCache } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

interface ItemCommentListRowProps {
  comment: JoinedComments;
  previousSwipeableRef: MutableRefObject<SwipeableMethods | null>;
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
    mutationFn: () => supabase.comments.deleteComment(comment.id),
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
    onSuccess: () => {
      updateMyCommentInCache({
        comment: { id: comment.id },
        userId: user!.id,
        queryClient,
        command: 'delete',
      });
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

const ItemCommentListRow = memo(function ItemCommentListRow({
  comment,
  previousSwipeableRef,
}: ItemCommentListRowProps) {
  const { styles } = useStyles(stylesheet);
  const user = useUserStore(store => store.user);

  const renderRightActions = useCallback(
    (_progress: any, translation: SharedValue<number>) => (
      <RightAction dragX={translation} comment={comment} />
    ),
    [comment],
  );

  const swipeableProps = useOnlyOneSwipeable(
    previousSwipeableRef as MutableRefObject<SwipeableMethods>,
  );

  const isMyself = comment.author.id === user?.id;

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
          <View style={styles.authorContainer}>
            <Text style={styles.authorText(isMyself)}>{comment.author.nickname}</Text>
            {isMyself ? (
              <View style={styles.authorIcon}>
                <Text style={styles.authorIconText}>나</Text>
              </View>
            ) : null}
          </View>
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
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  authorIcon: {
    width: theme.fontSize.sm,
    height: theme.fontSize.sm,
    borderRadius: theme.fontSize.sm / 4,
    backgroundColor: theme.colors.tint3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorIconText: {
    fontSize: theme.fontSize.xs,
    color: 'white',
    lineHeight: theme.fontSize.xs,
    fontWeight: 'bold',
  },
  authorText: (myself: boolean) => ({
    fontSize: theme.fontSize.normal,
    color: myself ? theme.colors.tint : `${theme.colors.typography}BB`,
    fontWeight: myself ? 'bold' : 'normal',
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
