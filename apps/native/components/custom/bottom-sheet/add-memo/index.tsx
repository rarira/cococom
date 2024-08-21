import { InsertMemo } from '@cococom/supabase/libs';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, RefObject, useCallback, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BottomSheetTextInput from '@/components/custom/text-input/bottom-sheet';
import TextInputCounterView from '@/components/custom/view/text-input-counter';
import BottomSheet from '@/components/ui/bottom-sheet';
import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { MAX_MEMO_LENGTH } from '@/constants';
import { supabase } from '@/libs/supabase';
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

  const [newMemoText, setNewMemoText] = useState('');

  const impossibleToSave = newMemoText.length === 0 || newMemoText.length > MAX_MEMO_LENGTH;

  const insertMemoMutation = useMutation({
    mutationFn: (newMemo: InsertMemo) => {
      return supabase.insertMemo(newMemo);
    },
    // onMutate: onMutate ? onMutate(queryClient) : undefined,
    onError: (_error, _variables, context) => {
      //   queryClient.setQueryData(queryKey, context?.previousData);
    },
  });

  const handlePress = useCallback(async () => {
    if (!user) {
      return;
    }

    const newMemo = {
      userId: user.id,
      itemId,
      content: newMemoText,
    };

    try {
      await insertMemoMutation.mutate(newMemo);
      bottomSheetRef.current?.dismiss();
    } catch (error) {
      console.error(error);
    }
  }, [bottomSheetRef, insertMemoMutation, itemId, newMemoText, user]);

  return (
    <BottomSheet
      index={1}
      ref={bottomSheetRef}
      snapPoints={['40%', '100%']}
      keyboardBlurBehavior="restore"
      onDismiss={() => setNewMemoText('')}
    >
      <View style={styles.contentContainer(bottom)}>
        <BottomSheetTextInput
          defaultValue={newMemoText}
          onChangeText={setNewMemoText}
          maxLength={MAX_MEMO_LENGTH}
          rootStyle={styles.textInput}
        />
        <View style={styles.actionContainer}>
          <TextInputCounterView maxLength={MAX_MEMO_LENGTH} currentLength={newMemoText.length} />
          <Button style={styles.saveButton} disabled={impossibleToSave} onPress={handlePress}>
            <Text style={styles.saveText}>저장</Text>
          </Button>
        </View>
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
  actionContainer: {
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.md,
    width: '100%',
  },
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
