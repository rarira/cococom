import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { memo, useCallback, useRef } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import RankingSortButton from '@/components/custom/button/ranking-sort';
import AlltimeRankingList from '@/components/custom/list/ranking/alltime';
import { useAlltimeRankingSort } from '@/hooks/alltime-ranking/useAlltimeRankingSort';
import { ALLTIME_RANKING_SORT_OPTIONS } from '@/libs/sort';

const AlltimeRankingTabView = memo(function AlltimeRankingTabView() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles } = useStyles(stylesheet);

  const { sort, handleSortChange, sortOption } = useAlltimeRankingSort(
    ALLTIME_RANKING_SORT_OPTIONS,
    _sort => bottomSheetModalRef.current?.dismiss(),
  );

  const handlePress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <RankingSortButton text={sortOption.text} onPress={handlePress} />
      <AlltimeRankingList sortOption={sortOption} contentContainerStyle={styles.container} />
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
    paddingHorizontal: 0,
    // paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
}));

export default AlltimeRankingTabView;
