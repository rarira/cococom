import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Href, Link } from 'expo-router';
import { memo, useCallback } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/core/card';
import Chip from '@/components/core/chip';
import Text from '@/components/core/text';
import { ITEM_DETAILS_TAB_NAMES } from '@/constants';
import { MyCommentToRender } from '@/hooks/comment/useMyComments';
import { formatDashedDate } from '@/libs/date';
import { handleMutateOfDeleteComment, queryKeys, updateMyComments } from '@/libs/react-query';
import { updateTotalCountInCache } from '@/libs/react-query/util';
import { ShadowPresets } from '@/libs/shadow';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

interface MyCommentListItemCardProps {
  item: MyCommentToRender[number];
  containerStyle?: StyleProp<ViewStyle>;
  onMutate: () => void;
}

const MyCommentListItemCard = memo(function MyCommentListItemCard({
  item: comment,
  containerStyle,
  onMutate,
}: MyCommentListItemCardProps) {
  const { styles } = useStyles(stylesheet);
  const user = useUserStore(store => store.user);

  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation({
    mutationFn: () => supabase.comments.deleteComment(comment.id),
    onMutate: () => {
      updateMyComments({
        comment,
        userId: user!.id,
        queryClient,
        command: 'delete',
      });

      onMutate();
    },
    onSuccess: () => {
      handleMutateOfDeleteComment({
        queryClient,
        queryKey: queryKeys.comments.byItem(comment.item.id),
        commentId: comment.id,
        itemQueryKey: queryKeys.items.byId(comment.item.id, user!.id),
      });

      updateTotalCountInCache({
        itemId: comment.item.id,
        queryClient,
        totalCountsColumn: 'totalCommentCount',
        updateType: 'decrease',
      });
    },
  });

  const handleLongPress = useCallback(async () => {
    //TODO: 첫 동작시 안내 팝업 띄우기
    try {
      await deleteCommentMutation.mutateAsync();
    } catch (e) {
      console.error(e);
    }
  }, [deleteCommentMutation]);

  const isOnline = comment.item.itemId.split('_')[1] === 'online';

  return (
    <Link
      href={`/(my)/item?itemId=${comment.item.id}&tab=${ITEM_DETAILS_TAB_NAMES.COMMENT}` as Href}
      asChild
      onLongPress={handleLongPress}
    >
      <Pressable>
        <Card style={[styles.cardContainer, containerStyle]}>
          <View style={styles.header}>
            <View style={styles.nameContainer}>
              {isOnline && <Chip text="온라인" style={styles.onlineChip} />}
              <Text numberOfLines={1} style={styles.itemNameText} ellipsizeMode="tail">
                {comment.item.itemName}
              </Text>
            </View>
            <Text numberOfLines={1} style={styles.dateText}>
              {formatDashedDate(comment.created_at)}
            </Text>
          </View>
          <Text style={styles.contentText}>{comment.content}</Text>
        </Card>
      </Pressable>
    </Link>
  );
});

const stylesheet = createStyleSheet(theme => ({
  cardContainer: {
    ...ShadowPresets.card(theme),
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightShadow,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  onlineChip: {
    backgroundColor: theme.colors.tint3,
  },
  itemNameText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.2,
    color: `${theme.colors.typography}AA`,
  },
  dateText: {
    fontSize: theme.fontSize.xs,
    lineHeight: theme.fontSize.xs * 1.2,
    color: `${theme.colors.typography}AA`,
  },
  contentText: {
    fontSize: theme.fontSize.normal,
    lineHeight: theme.fontSize.normal * 1.2,
  },
  thumbnail: {
    borderRadius: theme.borderRadius.md,
  },
}));

export default MyCommentListItemCard;
