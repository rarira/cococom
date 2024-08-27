import { InsertMemo } from '@cococom/supabase/libs';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, RefObject, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BottomSheetTextInput from '@/components/custom/text-input/bottom-sheet';
import BottomSheet from '@/components/ui/bottom-sheet';
import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { MAX_MEMO_LENGTH } from '@/constants';
import { handleMutateOfUpsertMemo, queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useMemoEditStore } from '@/store/memo-edit';
import { useUserStore } from '@/store/user';

interface AddMemoBottomSheetProps {
  bottomSheetRef: RefObject<BottomSheetModal>;
  itemId: number;
}

const AddMemoBottomSheet = memo(function AddMemoBottomSheet({
  bottomSheetRef,
  itemId,
}: AddMemoBottomSheetProps) {
  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();
  const user = useUserStore(store => store.user);
  const queryClient = useQueryClient();

  const { memo, setMemo, setBottomSheetRef } = useMemoEditStore();

  useEffect(() => {
    setBottomSheetRef(bottomSheetRef);
  }, [bottomSheetRef, setBottomSheetRef]);

  const impossibleToSave =
    !!memo?.content && (memo.content.length === 0 || memo.content.length > MAX_MEMO_LENGTH);

  const queryKey = queryKeys.memos.byItem(itemId, user!.id);

  const upsertMemoMutation = useMutation({
    mutationFn: (newMemo: InsertMemo) => {
      return supabase.upsertMemo(newMemo);
    },
    onMutate: (newMemo: InsertMemo) => {
      return handleMutateOfUpsertMemo({
        queryClient,
        queryKey,
        newMemo,
      });
    },
    onError: (_error, _variables, context) => {
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

    const newMemo = {
      userId: user.id,
      itemId,
      id: memo.id,
      content: memo.content,
    };

    try {
      await upsertMemoMutation.mutateAsync(newMemo);
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      console.error(error);
    }
  }, [user, itemId, memo, upsertMemoMutation, bottomSheetRef]);

  const handleDismiss = useCallback(() => {
    setMemo({ content: '' });
  }, [setMemo]);

  const handleChangeText = useCallback(
    (text: string) => {
      setMemo({ ...memo, content: text });
    },
    [memo, setMemo],
  );

  const renderButton = useCallback(() => {
    return (
      <Button style={styles.saveButton} disabled={impossibleToSave} onPress={handlePress}>
        <Text style={styles.saveText}>저장</Text>
      </Button>
    );
  }, [styles.saveButton, styles.saveText, impossibleToSave, handlePress]);

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
          defaultValue={memo.content!}
          onChangeText={handleChangeText}
          maxLength={MAX_MEMO_LENGTH}
          rootStyle={styles.textInput}
          renderButton={renderButton}
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

export default AddMemoBottomSheet;
