import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router, useNavigation } from 'expo-router';
import { memo, useCallback, useEffect, useRef } from 'react';

import { useUserStore } from '@/store/user';

import AddCommentBottomSheet from '../../bottom-sheet/add-comment';
import ItemCommentList from '../../list/item-comment';

export interface CommentTabViewProps {
  itemId: number;
}

const CommentTabView = memo(function CommentTabView({ itemId, tabIndex }: CommentTabViewProps) {
  const { user, setCallbackAfterSignIn } = useUserStore();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const navigation = useNavigation();

  useEffect(() => {
    console.log('CommentTabView', navigation.getState());
    return () => {
      console.log('CommentTabView unmount');
    };
  }, [navigation, tabIndex]);

  const handleAddCommentPress = useCallback(() => {
    if (!user) {
      setCallbackAfterSignIn(_user => {
        console.log('open bottom sheet');
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
