import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { memo, useCallback, useRef, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CircularProgress from '@/components/core/progress/circular';
import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import MyWishList from '@/components/custom/list/my-wish';
import { DiscountChannels } from '@/constants';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { useWishlists } from '@/hooks/wishlist/useWishlists';
import { useWishlistSort } from '@/hooks/wishlist/useWishlistSort';
import { WISHLIST_SORT_OPTIONS } from '@/libs/sort';

const MyWishlistTabView = memo(function MyWishlistTabView() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles } = useStyles(stylesheet);

  const [options, setOptions] = useState<string[]>([]);
  const isOnSale = options.includes('on_sale');

  const { sort, handleSortChange, sortOption } = useWishlistSort(WISHLIST_SORT_OPTIONS, _sort =>
    bottomSheetModalRef.current?.dismiss(),
  );

  const { handlePress: handleChannelPress, option: channelOption } =
    useDiscountRotateButton<DiscountChannels>();

  const handlePressHeaderRightButton = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const {
    wishlistResult,
    totalResults,
    queryKey,
    isFetchingNextPage,
    isLoading,
    handleEndReached,
  } = useWishlists({
    channel: channelOption.value,
    sortOption,
    isOnSale,
  });

  return (
    <>
      {isLoading && <CircularProgress style={styles.loadingProgress} />}
      {wishlistResult && (
        <MyWishList
          wishlistResult={wishlistResult}
          options={options}
          setOptions={setOptions}
          sortOption={sort}
          totalResults={totalResults}
          onPressHeaderRightButton={handlePressHeaderRightButton}
          queryKey={queryKey}
          isFetchingNextPage={isFetchingNextPage}
          handleChannelPress={handleChannelPress}
          channelOption={channelOption}
          onEndReached={handleEndReached}
        />
      )}
      <SortBottomSheet
        sortOptions={WISHLIST_SORT_OPTIONS}
        ref={bottomSheetModalRef}
        currentSort={sort}
        onSortChange={handleSortChange}
      />
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  loadingProgress: {
    marginTop: theme.spacing.xl * 3,
  },
}));

export default MyWishlistTabView;
