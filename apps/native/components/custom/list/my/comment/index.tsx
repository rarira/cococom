import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { QueryKey } from '@tanstack/react-query';
import { memo, useCallback, useMemo, useRef } from 'react';
import { LayoutAnimation, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import LinearProgress from '@/components/core/progress/linear';
import Text from '@/components/core/text';
import SortWithTextButton from '@/components/custom/button/sort-with-text';
import MyCommentListItemCard from '@/components/custom/card/list-item/my/comment';
import { MyCommentToRender } from '@/hooks/comment/useMyComments';
import { MyCommentSortOption } from '@/libs/sort';

interface MyCommentListProps extends Partial<FlashListProps<MyCommentToRender[number]>> {
  comments: MyCommentToRender;
  sortOption: MyCommentSortOption;
  onPressSortButton: () => void;
  queryKey: QueryKey;
  isFetchingNextPage: boolean;
}

const MyCommentList = memo(function MyCommentList({
  comments,
  sortOption,
  onPressSortButton,
  queryKey,
  isFetchingNextPage,
  ...restProps
}: MyCommentListProps) {
  const { styles } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  const listRef = useRef<FlashList<MyCommentToRender[number]>>(null);

  const renderItem = useCallback(({ item }: { item: MyCommentToRender[number]; index: number }) => {
    const handleMutate = () => {
      listRef.current?.prepareForLayoutAnimationRender();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };
    return <MyCommentListItemCard item={item} onMutate={handleMutate} />;
  }, []);

  const ListHeaderComponent = useMemo(() => {
    if (comments.length === 0) return null;

    return (
      <View style={styles.headerRowContainer}>
        <SortWithTextButton text={sortOption.text} onPress={onPressSortButton} />
      </View>
    );
  }, [comments.length, styles.headerRowContainer, sortOption, onPressSortButton]);

  const ListFooterComponent = useMemo(() => {
    if (!isFetchingNextPage) return null;

    return <LinearProgress />;
  }, [isFetchingNextPage]);

  const ListEmptyComponent = useMemo(() => {
    return (
      <Text style={styles.listEmptyText}>
        {`작성한 댓글이 없습니다.\n상품 상세 보기 화면 아래 쪽 '댓글'탭에서\n댓글을 작성해보세요.`}
      </Text>
    );
  }, [styles.listEmptyText]);

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.seperator} />,
    [styles.seperator],
  );

  return (
    <FlashList
      ref={listRef}
      data={comments}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListFooterComponentStyle={styles.fetchingNextProgress}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={renderItem}
      estimatedItemSize={80}
      keyExtractor={item => item?.id.toString()}
      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={styles.flashListContainer(tabBarHeight)}
      onEndReachedThreshold={0.5}
      {...restProps}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: (tabBarHeight: number) => ({
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: tabBarHeight + theme.spacing.xl,
  }),
  seperator: {
    height: theme.spacing.md * 2,
  },
  headerRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  fetchingNextProgress: {
    marginVertical: theme.spacing.md,
  },
  listEmptyText: {
    fontSize: theme.fontSize.normal,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: theme.spacing.xl * 3,
  },
}));

export default MyCommentList;
