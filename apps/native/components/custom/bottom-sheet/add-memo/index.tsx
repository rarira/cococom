import { InsertMemo, JoinedMyMemos } from '@cococom/supabase/types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, RefObject, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { is } from 'date-fns/locale';

import BottomSheet from '@/components/core/bottom-sheet';
import Button from '@/components/core/button';
import Text from '@/components/core/text';
import BottomSheetTextInput from '@/components/custom/text-input/bottom-sheet';
import { MAX_MEMO_LENGTH } from '@/constants';
import { handleMutateOfUpsertMemo, queryKeys, updateMyMemos } from '@/libs/react-query';
import { updateTotalCountInCache } from '@/libs/react-query/util';
import { supabase } from '@/libs/supabase';
import { useMemoEditStore } from '@/store/memo-edit';
import { useUserStore } from '@/store/user';

interface AddMemoBottomSheetProps {
  bottomSheetRef: RefObject<BottomSheetModal>;
  itemId: number;
  totalMemoCount: number;
}

const AddMemoBottomSheet = memo(function AddMemoBottomSheet({
  bottomSheetRef,
  itemId,
  totalMemoCount,
}: AddMemoBottomSheetProps) {
  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();
  const user = useUserStore(store => store.user);
  const queryClient = useQueryClient();

  const { memo, isEditMode, setMemo, setBottomSheetRef, setIsEditMode } = useMemoEditStore();

  useEffect(() => {
    setBottomSheetRef(bottomSheetRef);
  }, [bottomSheetRef, setBottomSheetRef]);

  const impossibleToSave =
    !!memo?.content && (memo.content.length === 0 || memo.content.length > MAX_MEMO_LENGTH);

  const queryKey = queryKeys.memos.byItem(itemId, user!.id);

  const upsertMemoMutation = useMutation({
    mutationFn: (newMemo: InsertMemo) => {
      return supabase.memos.upsertMemo(newMemo);
    },
    onMutate: () => {
      return { previousData: queryClient.getQueryData(queryKey) };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSuccess: (data, variables) => {
      const newMemo = {
        ...variables,
        ...data[0],
      };

      const newMyMemo: JoinedMyMemos = {
        ...(data[0] as any),
        content: variables.content,
      };

      newMyMemo.item.totalMemoCount = totalMemoCount;

      updateMyMemos({
        memo: newMyMemo,
        userId: user!.id,
        queryClient,
        command: isEditMode ? 'update' : 'insert',
      });

      if (!isEditMode) {
        updateTotalCountInCache({
          itemId,
          queryClient,
          excludeQueryKey: 'items',
          totalCountsColumn: 'totalMemoCount',
          updateType: 'increase',
        });
      }

      return handleMutateOfUpsertMemo({
        queryClient,
        queryKey,
        newMemo,
        itemQueryKey: queryKeys.items.byId(itemId, user?.id),
      });
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
      if (isEditMode) {
        setIsEditMode(false);
      }
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      console.error(error);
    }
  }, [
    user,
    itemId,
    memo.id,
    memo.content,
    upsertMemoMutation,
    isEditMode,
    bottomSheetRef,
    setIsEditMode,
  ]);

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
          placeholder="메모를 입력해주세요."
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

export default AddMemoBottomSheet;
