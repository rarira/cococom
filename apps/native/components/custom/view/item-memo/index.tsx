import BottomSheetModal from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModal';
import { memo, useRef } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button from '@/components/ui/button';
import Text from '@/components/ui/text';

import AddMemoBottomSheet from '../../bottom-sheet/add-memo';
import ItemMemoList from '../../list/item-memo';

interface ItemMemoViewProps {
  itemId: number;
}

const ItemMemoView = memo(function ItemMemoView({ itemId }: ItemMemoViewProps) {
  const { styles } = useStyles(stylesheet);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <View style={[styles.container]}>
        <Button onPress={() => bottomSheetRef.current?.present()}>
          <Text>Add Memo</Text>
        </Button>
        <ItemMemoList itemId={itemId} />
      </View>
      <AddMemoBottomSheet itemId={itemId} bottomSheetRef={bottomSheetRef} />
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    width: '100%',
  },
}));

export default ItemMemoView;
