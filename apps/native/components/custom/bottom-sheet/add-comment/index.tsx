import { InsertComment } from '@cococom/supabase/libs';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, RefObject, useCallback, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BottomSheetTextInput from '@/components/custom/text-input/bottom-sheet';
import BottomSheet from '@/components/ui/bottom-sheet';
import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { MAX_MEMO_LENGTH } from '@/constants';
import { handleMutateOfInsertComment, queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

interface AddCommentBottomSheetProps {
  bottomSheetRef: RefObject<BottomSheetModal>;
  itemId: number;
}

const AddCommentBottomSheet = memo(function AddCommentBottomSheet({
  bottomSheetRef,
  itemId,
}: AddCommentBottomSheetProps) {
  const [content, setContent] = useState('');

  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();
  const user = useUserStore(store => store.user);
  const queryClient = useQueryClient();

  const queryKey = queryKeys.comments.byItem(itemId);

  const insertCommentMutation = useMutation({
    mutationFn: (newComment: InsertComment) => {
      return supabase.insertComment(newComment);
    },
    onMutate: (newComment: InsertComment) => {
      return handleMutateOfInsertComment({
        queryClient,
        queryKey,
        newComment,
        itemQueryKey: queryKeys.items.byId(itemId, user?.id),
      });
    },
    onError: (_error, _variables, context) => {
      console.error('insertCommentMutation error', _error);
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSuccess: (_data, variables) => {
      if (variables.id) return;
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handlePress = useCallback(async () => {
    if (!user) {
      return;
    }

    const newComment = {
      user_id: user.id,
      item_id: itemId,
      content,
    };

    try {
      await insertCommentMutation.mutateAsync(newComment);
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      console.error(error);
    }
  }, [user, itemId, content, insertCommentMutation, bottomSheetRef]);

  const handleDismiss = useCallback(() => {
    setContent('');
  }, []);

  const renderButton = useCallback(() => {
    return (
      <Button style={styles.saveButton} disabled={content.length === 0} onPress={handlePress}>
        <Text style={styles.saveText}>저장</Text>
      </Button>
    );
  }, [styles.saveButton, styles.saveText, content.length, handlePress]);

  return (
    <BottomSheet
      index={1}
      ref={bottomSheetRef}
      snapPoints={['40%', '100%']}
      keyboardBlurBehavior="restore"
      onDismiss={handleDismiss}
    >
      <View style={styles.contentContainer(bottom)}>
        <BottomSheetTextInput
          defaultValue={content}
          onChangeText={setContent}
          maxLength={MAX_MEMO_LENGTH}
          rootStyle={styles.textInput}
          renderButton={renderButton}
          placeholder="댓글을 입력해주세요."
        />
      </View>
    </BottomSheet>
  );
});

const stylesheet = createStyleSheet(theme => ({
  textInput: {
    minHeight: theme.fontSize.md * 1.5 * 6,
  },
  contentContainer: (bottom: number) => ({
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: bottom,
    paddingTop: theme.spacing.lg,
  }),
  saveButton: {
    backgroundColor: theme.colors.tint,
    paddingHorizontal: theme.spacing.lg,
  },
  saveText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.normal,
    fontWeight: 'bold',
  },
}));

export default AddCommentBottomSheet;