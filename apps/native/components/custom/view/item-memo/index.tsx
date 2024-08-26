import BottomSheetModal from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModal';
import { memo, useCallback, useRef } from 'react';

import AddMemoBottomSheet from '../../bottom-sheet/add-memo';
import ItemMemoList from '../../list/item-memo';
import { MemoTabViewProps } from '../../tab-view/memo';

interface ItemMemoViewProps extends MemoTabViewProps {}

const ItemMemoView = memo(function ItemMemoView({ itemId }: ItemMemoViewProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleAddMemoPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, [bottomSheetRef]);

  return (
    <>
      <ItemMemoList itemId={itemId} onAddMemoPress={handleAddMemoPress} />
      <AddMemoBottomSheet itemId={itemId} bottomSheetRef={bottomSheetRef} />
    </>
  );
});

export default ItemMemoView;
