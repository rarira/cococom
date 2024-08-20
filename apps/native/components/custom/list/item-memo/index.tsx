import { User } from '@cococom/supabase/types';
import BottomSheetModal from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModal';
import { memo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BottomSheet from '@/components/ui/bottom-sheet';
import Button from '@/components/ui/button';
import Text from '@/components/ui/text';

import BottomSheetTextInput from '../../text-input/bottom-sheet';
import TextInputCounterView from '../../view/text-input-counter';

interface ItemMemoListProps {
  user: User;
}

const ItemMemoList = memo(function ItemMemoList({ user }: ItemMemoListProps) {
  const { styles } = useStyles(stylesheet);
  const { bottom } = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [newMemoText, setNewMemoText] = useState('');

  return (
    <>
      <View style={[styles.container]}>
        <Button onPress={() => bottomSheetRef.current?.present()}>
          <Text>Add Memo</Text>
        </Button>
        <Text>Item Memo List of ${user.id}</Text>
        <Text>Item Memo List of ${user.id}</Text>
        <Text>Item Memo List of ${user.id}</Text>
        <Text>Item Memo List of ${user.id}</Text>
        <Text>Item Memo List of ${user.id}</Text>
        <Text>Item Memo List of ${user.id}</Text>
      </View>
      <BottomSheet
        index={1}
        ref={bottomSheetRef}
        snapPoints={['40%', '100%']}
        keyboardBlurBehavior="restore"
      >
        <View style={styles.contentContainer(bottom)}>
          <BottomSheetTextInput
            defaultValue={newMemoText}
            onChangeText={setNewMemoText}
            maxLength={140}
            rootStyle={styles.textInput}
          />
          <TextInputCounterView
            maxLength={140}
            currentLength={newMemoText.length}
            style={styles.counter}
          />
        </View>
      </BottomSheet>
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  textInput: {
    minHeight: theme.fontSize.md * 1.5 * 6,
  },
  contentContainer: (bottom: number) => ({
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: bottom,
  }),
  counter: {
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
}));

export default ItemMemoList;
