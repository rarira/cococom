import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { memo, useCallback, useRef } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CircularProgress from '@/components/core/progress/circular';
import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import { useMyMemos } from '@/hooks/memo/useMyMemos';
import { useSort } from '@/hooks/sort/useSort';
import { MY_COMMENT_SORT_OPTIONS } from '@/libs/sort/my-comment';
import { MY_MEMO_SORT_OPTIONS } from '@/libs/sort/my-memo';

const MyMemoTabView = memo(function MyMemoTabView() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles } = useStyles(stylesheet);

  const { sort, handleSortChange, sortOption } = useSort({
    sortOptions: MY_MEMO_SORT_OPTIONS,
    callback: _sort => bottomSheetModalRef.current?.dismiss(),
    initialSort: 'recent',
  });

  const handlePressSortButton = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { memos, isLoading, handleEndReached, isFetchingNextPage, queryKey } =
    useMyMemos(sortOption);

  console.log('my memo tab view', { memos });
  return (
    <>
      {isLoading && <CircularProgress style={styles.loadingProgress} />}
      {/* {comments && (
        <MyCommentList
          comments={comments}
          sortOption={sortOption}
          onPressSortButton={handlePressSortButton}
          queryKey={queryKey}
          channelOption={channelOption}
          onEndReached={handleEndReached}
          contentContainerStyle={styles.container}
        />
      )} */}
      <SortBottomSheet
        sortOptions={MY_COMMENT_SORT_OPTIONS}
        ref={bottomSheetModalRef}
        currentSort={sort}
        onSortChange={handleSortChange}
      />
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  loadingProgress: {
    marginTop: theme.spacing.xl * 3,
  },
}));

export default MyMemoTabView;
