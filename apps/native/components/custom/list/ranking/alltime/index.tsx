import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { memo, useCallback, useRef } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import RankingSortButton from '@/components/custom/button/ranking-sort';
import { useAlltimeRankingSort } from '@/hooks/alltime-ranking/useAlltimeRankingSort';
import { queryKeys } from '@/libs/react-query';
import { ALLTIME_RANKING_SORT_OPTIONS } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

interface AlltimeRankingListProps {}

const AlltimeRankingList = memo(function AlltimeRankingList({}: AlltimeRankingListProps) {
  const { styles } = useStyles(stylesheet);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const user = useUserStore(store => store.user);

  const { sort, handleSortChange, sortOption } = useAlltimeRankingSort(
    ALLTIME_RANKING_SORT_OPTIONS,
    _sort => bottomSheetModalRef.current?.dismiss(),
  );

  const handlePress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.alltimeRankings(user?.id ?? null, sortOption.field, sortOption.orderBy, 50),
    queryFn: () => {
      return supabase.fetchAlltimeRankingItems({
        userId: user?.id,
        orderByColumn: sortOption.field,
        orderByDirection: sortOption.orderBy,
        limitCount: 50,
      });
    },
  });

  console.log('alltime ranking list data', data);

  return (
    <>
      <RankingSortButton text={sortOption.text} onPress={handlePress} />
      {/* <DiscountList sortOption={sortOption} limit={50} contentContainerStyle={styles.container} /> */}
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

export default AlltimeRankingList;
