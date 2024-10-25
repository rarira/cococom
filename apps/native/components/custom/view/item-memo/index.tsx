import BottomSheetModal from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModal';
import { memo, useCallback, useRef } from 'react';

import AddMemoBottomSheet from '@/components/custom/bottom-sheet/add-memo';
import ItemMemoList from '@/components/custom/list/item-memo';
import { ItemMemoTabViewProps } from '@/components/custom/tab-view/item/memo';

interface ItemMemoViewProps extends ItemMemoTabViewProps {}

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
