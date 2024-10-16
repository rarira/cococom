import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { memo, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import DiscountChannelRotateButton from '@/components/custom/button/discount-channel-rotate';
import RankingSortButton from '@/components/custom/button/ranking-sort';
import DiscountList from '@/components/custom/list/discount';
import { DiscountChannels, DiscountRotateButtonOptions, PortalHostNames } from '@/constants';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { useDiscountsSort } from '@/hooks/discount/useDiscountsSort';
import { DISCOUNTED_RANKING_SORT_OPTIONS } from '@/libs/sort';

const DiscountedRankingTabView = memo(function DiscountedRankingTabView() {
  const { styles } = useStyles(stylesheet);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { sort, handleSortChange, sortOption } = useDiscountsSort(
    DISCOUNTED_RANKING_SORT_OPTIONS,
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
      <DiscountList
        sortOption={sortOption}
        limit={50}
        portalHostName={PortalHostNames.RANKING}
        refreshable
        contentContainerStyle={styles.container}
        channel={channelOption.value}
        ranked
      />
      <SortBottomSheet
        ref={bottomSheetModalRef}
        sortOptions={DISCOUNTED_RANKING_SORT_OPTIONS}
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

export default DiscountedRankingTabView;
