import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { memo, useCallback, useRef } from 'react';

import AddCommentBottomSheet from '@/components/custom/bottom-sheet/add-comment';
import ItemCommentList from '@/components/custom/list/item-comment';
import { useUserStore } from '@/store/user';

export interface ItemCommentTabViewProps {
  itemId: number;
}

const ItemCommentTabView = memo(function ItemCommentTabView({ itemId }: ItemCommentTabViewProps) {
  const { user, setCallbackAfterSignIn } = useUserStore();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleAddCommentPress = useCallback(() => {
    if (!user) {
      setCallbackAfterSignIn(_user => {
        bottomSheetRef.current?.present();
      });
      router.push('/auth/signin');
      return;
    }
    bottomSheetRef.current?.present();
  }, [setCallbackAfterSignIn, user]);

  return (
    <>
      <ItemCommentList itemId={itemId} onAddCommentPress={handleAddCommentPress} />
      <AddCommentBottomSheet itemId={itemId} bottomSheetRef={bottomSheetRef} />
    </>
  );
});

export default ItemCommentTabView;
