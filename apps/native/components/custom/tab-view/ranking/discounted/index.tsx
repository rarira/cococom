import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { memo, useCallback, useRef } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import RankingSortButton from '@/components/custom/button/ranking-sort';
import DiscountList from '@/components/custom/list/discount';
import { PortalHostNames } from '@/constants';
import { useDiscountsSort } from '@/hooks/discount/useDiscountsSort';
import { DISCOUNTED_RANKING_SORT_OPTIONS } from '@/libs/sort';

const DiscountedRankingTabView = memo(function DiscountedRankingTabView() {
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
      <RankingSortButton text={sortOption.text} onPress={handlePress} style={styles.container} />
      <DiscountList
        sortOption={sortOption}
        limit={50}
        portalHostName={PortalHostNames.RANKING}
        refreshable
        contentContainerStyle={styles.container}
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
}));

export default DiscountedRankingTabView;
