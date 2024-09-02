import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { memo, useCallback, useRef } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiscountedRankingSortBottomSheet from '@/components/custom/bottom-sheet/ranking-sort/discounted';
import RankingSortButton from '@/components/custom/button/ranking-sort';
import DiscountList from '@/components/custom/list/discount';
import { useDiscountsSort } from '@/hooks/discount/useDiscountsSort';
import { DISCOUNTED_RANKING_SORT_OPTIONS } from '@/libs/sort';

interface DiscountedRankingListProps {}

const DiscountedRankingList = memo(function DiscountedRankingList({}: DiscountedRankingListProps) {
  const { styles } = useStyles(stylesheet);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { sort, handleSortChange, sortOption } = useDiscountsSort(
    DISCOUNTED_RANKING_SORT_OPTIONS,
    _sort => bottomSheetModalRef.current?.dismiss(),
  );

  const handlePress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <RankingSortButton text={sortOption.text} onPress={handlePress} />
      <DiscountList sortOption={sortOption} limit={50} contentContainerStyle={styles.container} />
      <DiscountedRankingSortBottomSheet
        ref={bottomSheetModalRef}
        currentSort={sort}
        onSortChange={handleSortChange}
      />
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: 0,
    // paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
}));

export default DiscountedRankingList;
