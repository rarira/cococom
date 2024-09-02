import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, memo, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BottomSheet from '@/components/ui/bottom-sheet';
import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import { DISCOUNTED_RANKING_SORT_OPTIONS } from '@/libs/sort';

interface DiscountedRankingSortBottomSheetProps {
  currentSort: keyof typeof DISCOUNTED_RANKING_SORT_OPTIONS;
  onSortChange: (sort: keyof typeof DISCOUNTED_RANKING_SORT_OPTIONS) => void;
}

const DiscountedRankingSortBottomSheet = memo(
  forwardRef<BottomSheetModal, DiscountedRankingSortBottomSheetProps>(
    function RankingSortBottomSheet(
      { currentSort, onSortChange }: DiscountedRankingSortBottomSheetProps,
      ref,
    ) {
      const { styles } = useStyles(stylesheet);

      const sortOptions = useMemo(
        () =>
          Object.entries(DISCOUNTED_RANKING_SORT_OPTIONS).map(([key, sortOption]) => (
            <Button
              key={key}
              onPress={() => {
                onSortChange(key);
              }}
              style={({ pressed }) => styles.button({ selected: currentSort === key, pressed })}
            >
              <Text style={styles.text(currentSort === key)}>{sortOption.text}</Text>
            </Button>
          )),
        [currentSort, onSortChange, styles],
      );

      return (
        <BottomSheet ref={ref} index={1} title="정렬 방법 변경">
          <View style={styles.container}>{sortOptions}</View>
        </BottomSheet>
      );
    },
  ),
);

const stylesheet = createStyleSheet(theme => ({
  container: { flexDirection: 'column', gap: theme.spacing.sm, alignItems: 'center' },
  text: (isCurrent: boolean) => ({
    fontSize: (theme.fontSize.md + theme.fontSize.sm) / 2,
    opacity: isCurrent ? 1 : 0.7,
    color: isCurrent ? theme.colors.background : theme.colors.typography,
    fontWeight: isCurrent ? 'bold' : 'normal',
  }),
  button: ({ selected, pressed }: { selected: boolean; pressed: boolean }) => ({
    backgroundColor: selected ? theme.colors.tint2 : 'transparent',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    opacity: pressed ? 0.5 : 1,
  }),
}));

export default DiscountedRankingSortBottomSheet;
