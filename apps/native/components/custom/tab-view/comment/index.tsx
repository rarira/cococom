import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { memo, useCallback, useRef } from 'react';

import { useUserStore } from '@/store/user';

import AddCommentBottomSheet from '../../bottom-sheet/add-comment';
import ItemCommentList from '../../list/item-comment';

export interface CommentTabViewProps {
  itemId: number;
}

const CommentTabView = memo(function CommentTabView({ itemId, tabIndex }: CommentTabViewProps) {
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

export default CommentTabView;
