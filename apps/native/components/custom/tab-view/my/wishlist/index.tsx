import { memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountChannelRotateButton from '@/components/custom/button/discount-channel-rotate';
import { DiscountChannels } from '@/constants';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { useWishlists } from '@/hooks/wishlist/useWishlists';

const MyWishlistTabView = memo(function MyWishlistTabView() {
  // const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles } = useStyles(stylesheet);

  // const { sort, handleSortChange, sortOption } = useAlltimeRankingSort(
  //   ALLTIME_RANKING_SORT_OPTIONS,
  //   _sort => bottomSheetModalRef.current?.dismiss(),
  // );

  const { handlePress: handleChannelPress, option: channelOption } =
    useDiscountRotateButton<DiscountChannels>();

  // const handlePress = useCallback(() => {
  //   bottomSheetModalRef.current?.present();
  // }, []);

  const { data } = useWishlists({ channel: channelOption.value });

  return (
    <>
      <View style={styles.headerRowContainer}>
        {/* <RankingSortButton text={sortOption.text} onPress={handlePress} /> */}
        <DiscountChannelRotateButton onPress={handleChannelPress} channelOption={channelOption} />
      </View>
      {/* <AlltimeRankingList
        sortOption={sortOption}
        contentContainerStyle={styles.container}
        channel={channelOption.value}
      /> */}
      {/* <SortBottomSheet
        sortOptions={ALLTIME_RANKING_SORT_OPTIONS}
        ref={bottomSheetModalRef}
        currentSort={sort}
        onSortChange={handleSortChange}
      /> */}
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
    paddingHorizontal: theme.screenHorizontalPadding,
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
}));

export default MyWishlistTabView;
