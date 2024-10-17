import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { memo, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import DiscountChannelRotateButton from '@/components/custom/button/discount-channel-rotate';
import RankingSortButton from '@/components/custom/button/ranking-sort';
import AlltimeRankingList from '@/components/custom/list/ranking/alltime';
import { DiscountChannels, DiscountRotateButtonOptions } from '@/constants';
import { useAlltimeRankingSort } from '@/hooks/alltime-ranking/useAlltimeRankingSort';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { ALLTIME_RANKING_SORT_OPTIONS } from '@/libs/sort';

const AlltimeRankingTabView = memo(function AlltimeRankingTabView() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles } = useStyles(stylesheet);

  const { sort, handleSortChange, sortOption } = useAlltimeRankingSort(
    ALLTIME_RANKING_SORT_OPTIONS,
    _sort => bottomSheetModalRef.current?.dismiss(),
  );

  const { handlePress: handleChannelPress, option: channelOption } =
    useDiscountRotateButton<DiscountChannels>(DiscountRotateButtonOptions);

  const handlePress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <View style={styles.headerRowContainer}>
        <RankingSortButton text={sortOption.text} onPress={handlePress} />
        <DiscountChannelRotateButton onPress={handleChannelPress} channelOption={channelOption} />
      </View>
      <AlltimeRankingList
        sortOption={sortOption}
        contentContainerStyle={styles.container}
        channel={channelOption.value}
      />
      <SortBottomSheet
        sortOptions={ALLTIME_RANKING_SORT_OPTIONS}
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
    paddingHorizontal: theme.screenHorizontalPadding,
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
}));

export default AlltimeRankingTabView;
