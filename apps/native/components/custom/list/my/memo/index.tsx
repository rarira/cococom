import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { QueryKey } from '@tanstack/react-query';
import { memo, useCallback, useMemo, useRef } from 'react';
import { LayoutAnimation, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import LinearProgress from '@/components/core/progress/linear';
import Text from '@/components/core/text';
import MyMemoListItemCard from '@/components/custom/card/list-item/my/memo';
import { MyMemoToRender } from '@/hooks/memo/useMyMemos';
import { MyMemoSortOption } from '@/libs/sort/my-memo';
import SortWithTextButton from '@/components/custom/button/modal-close/sort-with-text';

interface MyMemoListProps extends Partial<FlashListProps<MyMemoToRender[number]>> {
  memos: MyMemoToRender;
  sortOption: MyMemoSortOption;
  onPressSortButton: () => void;
  queryKey: QueryKey;
  isFetchingNextPage: boolean;
}

const MyMemoList = memo(function MyMemoList({
  memos,
  sortOption,
  onPressSortButton,
  queryKey,
  isFetchingNextPage,
  ...restProps
}: MyMemoListProps) {
  const { styles } = useStyles(stylesheet);

  const tabBarHeight = useBottomTabBarHeight();

  const listRef = useRef<FlashList<MyMemoToRender[number]>>(null);

  const renderItem = useCallback(({ item }: { item: MyMemoToRender[number]; index: number }) => {
    const handleMutate = () => {
      listRef.current?.prepareForLayoutAnimationRender();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };
    return <MyMemoListItemCard item={item} onMutate={handleMutate} />;
  }, []);

  const ListHeaderComponent = useMemo(() => {
    if (memos.length === 0) return null;

    return (
      <View style={styles.headerRowContainer}>
        <SortWithTextButton text={sortOption.text} onPress={onPressSortButton} />
      </View>
    );
  }, [memos.length, styles.headerRowContainer, sortOption, onPressSortButton]);

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
      data={memos}
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

export default MyMemoList;
