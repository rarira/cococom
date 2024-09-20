import { Tables } from '@cococom/supabase/types';
import { memo, useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton from '@/components/core/button/icon';
import CircularProgress from '@/components/core/progress/circular';
import LinearProgress from '@/components/core/progress/linear';
import Text from '@/components/core/text';
import { MemoTabViewProps } from '@/components/custom/tab-view/item/memo';
import { useInfiniteMemos } from '@/hooks/memo/useInfiniteMemos';

import ItemMemoListRow from './&row';

interface ItemMemoListProps extends MemoTabViewProps {
  onAddMemoPress?: () => void;
}

const ItemMemoList = memo(function ItemMemoList({ itemId, onAddMemoPress }: ItemMemoListProps) {
  const { styles, theme } = useStyles(stylesheet);
  const {
    memos,
    error,
    isFetchingNextPage,
    isLoading,
    handleEndReached,
    refreshing,
    handleRefresh,
  } = useInfiniteMemos(itemId);

  const previousSwipeableRef = useRef<SwipeableMethods>(null);

  const renderItem = useCallback(({ item }: { item: NonNullable<Tables<'memos'>> }) => {
    return <ItemMemoListRow memo={item} key={item.id} ref={previousSwipeableRef} />;
  }, []);

  const ListHeaderComponent = useMemo(() => {
    return (
      <IconButton
        iconProps={{
          font: { type: 'FontAwesomeIcon', name: 'sticky-note-o' },
          color: theme.colors.typography,
          size: theme.fontSize.lg,
        }}
        text="메모 추가"
        onPress={onAddMemoPress}
        textStyle={styles.addButtonText}
      />
    );
  }, [onAddMemoPress, styles.addButtonText, theme.colors.typography, theme.fontSize.lg]);

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.listEmptyContainer}>
        <Text style={styles.listEmptyTitle}>저장된 메모가 없습니다</Text>
        <Text style={styles.listEmptyTitle}>
          위의 <Text style={styles.listEmptyBoldText}>'메모 추가'</Text> 버튼을 눌러 작성해 보세요
        </Text>
        <Text style={styles.listEmptyInfoText}>저장된 메모는 작성자 본인만 볼 수 있습니다</Text>
      </View>
    ),
    [styles],
  );

  const ListFooterComponent = useMemo(() => {
    if (!isFetchingNextPage) {
      return null;
    }

    return <LinearProgress />;
  }, [isFetchingNextPage]);

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.seperator} />,
    [styles.seperator],
  );

  if (error) {
    return <Text>{error?.message}</Text>;
  }

  if (isLoading) {
    return <CircularProgress style={styles.loadinProgress} />;
  }

  return (
    <Tabs.FlashList
      data={memos}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      estimatedItemSize={50}
      ListHeaderComponent={ListHeaderComponent}
      ListHeaderComponentStyle={styles.addButton}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      ListFooterComponentStyle={styles.fetchingNextProgress}
      keyExtractor={item => item.id.toString()}
      ItemSeparatorComponent={ItemSeparatorComponent}
      onEndReachedThreshold={0.5}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    height: '100%',
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  listEmptyContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing.xl * 3,
  },
  listEmptyTitle: {
    fontSize: theme.fontSize.normal,
  },
  listEmptyBoldText: {
    fontSize: theme.fontSize.normal,
    fontWeight: 'bold',
  },
  listEmptyInfoText: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.tint,
    marginTop: theme.spacing.md,
  },
  loadinProgress: {
    flex: 1,
    marginTop: theme.spacing.xl * 3,
  },
  fetchingNextProgress: {
    marginVertical: theme.spacing.md,
  },
  seperator: {
    backgroundColor: `${theme.colors.shadow}33`,
    height: 1,
    width: '100%',
  },
  addButton: {
    paddingTop: theme.spacing.lg,
    alignSelf: 'flex-end',
  },
  addButtonText: {
    fontSize: theme.fontSize.normal,
    marginLeft: theme.spacing.sm,
  },
  emptyPlaceholder: (minHeight: number) => ({ width: '100%', height: '100%', minHeight }),
}));

export default ItemMemoList;
