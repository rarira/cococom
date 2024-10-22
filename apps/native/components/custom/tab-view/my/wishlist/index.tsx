import { memo, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import DiscountChannelRotateButton from '@/components/custom/button/discount-channel-rotate';
import HeaderRightButton from '@/components/custom/button/header/right';
import { DiscountChannels } from '@/constants';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { useWishlists } from '@/hooks/wishlist/useWishlists';
import { useWishlistSort } from '@/hooks/wishlist/useWishlistSort';
import { WISHLIST_SORT_OPTIONS } from '@/libs/sort';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const MyWishlistTabView = memo(function MyWishlistTabView() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles, theme } = useStyles(stylesheet);

  const { sort, handleSortChange, sortOption } = useWishlistSort(WISHLIST_SORT_OPTIONS, _sort =>
    bottomSheetModalRef.current?.dismiss(),
  );

  const { handlePress: handleChannelPress, option: channelOption } =
    useDiscountRotateButton<DiscountChannels>();

  const handlePress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { data } = useWishlists({ channel: channelOption.value, sortOption, isOnSale: false });

  return (
    <>
      <View style={styles.headerRowContainer}>
        <HeaderRightButton
          iconProps={{ font: { type: 'MaterialIcon', name: 'sort' } }}
          onPress={handlePress}
        />
        <DiscountChannelRotateButton onPress={handleChannelPress} channelOption={channelOption} />
      </View>
      {/* <AlltimeRankingList
        sortOption={sortOption}
        contentContainerStyle={styles.container}
        channel={channelOption.value}
      /> */}
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
  container: {
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  headerRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
}));

export default MyWishlistTabView;
