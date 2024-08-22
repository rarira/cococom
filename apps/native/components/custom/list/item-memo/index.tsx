import { Tables } from '@cococom/supabase/types';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import { useInfiniteMemos } from '@/hooks/memo/useInfiniteMemos';

import ItemMemoListRow from './&row';

interface ItemMemoListProps {
  itemId: number;
}

const ItemMemoList = memo(function ItemMemoList({ itemId }: ItemMemoListProps) {
  const { styles } = useStyles(stylesheet);
  const { memos, error, isFetching, handleEndReached } = useInfiniteMemos(itemId);

  const renderItem = useCallback(({ item }: { item: NonNullable<Tables<'memos'>> }) => {
    return <ItemMemoListRow memo={item} key={item.id} />;
  }, []);

  if (error || !memos) {
    return <Text>{error?.message}</Text>;
  }

  return (
    <FlashList
      data={memos}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      estimatedItemSize={100}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {},
}));

export default ItemMemoList;
