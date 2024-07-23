import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, memo, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BottomSheet from '@/components/ui/bottom-sheet';
import Text from '@/components/ui/text';
import { DISCOUNT_SORT_OPTIONS } from '@/libs/sorts';

interface SalesSortBottomSheetProps {
  currentSort: keyof typeof DISCOUNT_SORT_OPTIONS;
}

const SalesSortBottomSheet = memo(
  forwardRef<BottomSheetModal, SalesSortBottomSheetProps>(function SalesSortBottomSheet(
    { currentSort }: SalesSortBottomSheetProps,
    ref,
  ) {
    const { styles } = useStyles(stylesheet);

    const sortOptions = useMemo(
      () =>
        Object.entries(DISCOUNT_SORT_OPTIONS).map(([key, sortOption]) => (
          <Text key={key} style={styles.text(currentSort === key)}>
            {sortOption.text}
          </Text>
        )),
      [currentSort, styles],
    );

    return (
      <BottomSheet ref={ref} index={1} title="정렬 방법 변경">
        <View style={styles.container}>{sortOptions}</View>
      </BottomSheet>
    );
  }),
);

const stylesheet = createStyleSheet(theme => ({
  container: { flexDirection: 'column', gap: theme.spacing.sm, alignItems: 'center' },
  text: (isCurrent: boolean) => ({
    fontSize: (theme.fontSize.md + theme.fontSize.sm) / 2,
    opacity: isCurrent ? 1 : 0.7,
  }),
}));

export default SalesSortBottomSheet;
