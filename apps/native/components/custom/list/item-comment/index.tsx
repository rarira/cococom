import { JoinedComments } from '@cococom/supabase/types';
import { memo, useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import { SwipeableMethods } from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { MemoTabViewProps } from '@/components/custom/tab-view/memo';
import IconButton from '@/components/ui/button/icon';
import CircularProgress from '@/components/ui/progress/circular';
import LinearProgress from '@/components/ui/progress/linear';
import Text from '@/components/ui/text';
import { useInfiniteComments } from '@/hooks/comment/useInfiniteComments';
import { useRealtimeComments } from '@/hooks/comment/useRealtimeComments';

import ItemCommentListRow from './&row';

interface ItemCommentListProps extends MemoTabViewProps {
  onAddCommentPress?: () => void;
}

const ItemCommentList = memo(function ItemCommentList({
  itemId,
  onAddCommentPress,
}: ItemCommentListProps) {
  const { styles, theme } = useStyles(stylesheet);
  const {
    comments,
    error,
    isFetchingNextPage,
    isLoading,
    handleEndReached,
    refreshing,
    handleRefresh,
  } = useInfiniteComments(itemId);

  useRealtimeComments(itemId);

  const previousSwipeableRef = useRef<SwipeableMethods>(null);

  const renderItem = useCallback(({ item }: { item: NonNullable<JoinedComments> }) => {
    return <ItemCommentListRow comment={item} key={item.id} ref={previousSwipeableRef} />;
  }, []);

  const ListHeaderComponent = useMemo(() => {
    return (
      <IconButton
        iconProps={{
          font: { type: 'MaterialIcon', name: 'post-add' },
          color: theme.colors.typography,
          size: theme.fontSize.lg,
        }}
        text="댓글 추가"
        onPress={onAddCommentPress}
        textStyle={styles.addButtonText}
      />
    );
  }, [onAddCommentPress, styles.addButtonText, theme.colors.typography, theme.fontSize.lg]);

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.listEmptyContainer}>
        <Text style={styles.listEmptyTitle}>댓글이 없습니다</Text>
        <Text style={styles.listEmptyTitle}>
          위의 <Text style={styles.listEmptyBoldText}>'댓글 추가'</Text> 버튼을 눌러 다른 사용자와
          정보를 공유하세요!
        </Text>
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
      data={comments}
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
  },
  emptyPlaceholder: (minHeight: number) => ({ width: '100%', height: '100%', minHeight }),
}));

export default ItemCommentList;