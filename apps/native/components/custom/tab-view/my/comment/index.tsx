import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { memo, useCallback, useRef } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CircularProgress from '@/components/core/progress/circular';
import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import MyCommentList from '@/components/custom/list/my/comment';
import { DiscountChannels } from '@/constants';
import { useMyComments } from '@/hooks/comment/useMyComments';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { useSort } from '@/hooks/sort/useSort';
import { MY_COMMENT_SORT_OPTIONS } from '@/libs/sort/my-comment';

const MyCommentTabView = memo(function MyCommentTabView() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles } = useStyles(stylesheet);

  const { sort, handleSortChange, sortOption } = useSort({
    sortOptions: MY_COMMENT_SORT_OPTIONS,
    callback: _sort => bottomSheetModalRef.current?.dismiss(),
    initialSort: 'recent',
  });

  const { handlePress: handleChannelPress, option: channelOption } =
    useDiscountRotateButton<DiscountChannels>();

  const handlePressSortButton = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { comments, isLoading, handleEndReached, isFetchingNextPage, queryKey } =
    useMyComments(sortOption);

  return (
    <>
      {isLoading && <CircularProgress style={styles.loadingProgress} />}
      {comments && (
        <MyCommentList
          comments={comments}
          sortOption={sortOption}
          onPressSortButton={handlePressSortButton}
          queryKey={queryKey}
          isFetchingNextPage={isFetchingNextPage}
          handleChannelPress={handleChannelPress}
          channelOption={channelOption}
          onEndReached={handleEndReached}
          contentContainerStyle={styles.container}
        />
      )}
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

export default MyCommentTabView;
