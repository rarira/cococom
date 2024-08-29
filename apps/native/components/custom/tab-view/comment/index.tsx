import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { memo, useCallback, useRef } from 'react';

import AddCommentBottomSheet from '../../bottom-sheet/add-comment';
import ItemCommentList from '../../list/item-comment';

export interface CommentTabViewProps {
  itemId: number;
}

const CommentTabView = memo(function CommentTabView({ itemId }: CommentTabViewProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleAddMemoPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, [bottomSheetRef]);

  return (
    <>
      <ItemCommentList itemId={itemId} onAddCommentPress={handleAddMemoPress} />
      <AddCommentBottomSheet itemId={itemId} bottomSheetRef={bottomSheetRef} />
    </>
  );
});

export default CommentTabView;
