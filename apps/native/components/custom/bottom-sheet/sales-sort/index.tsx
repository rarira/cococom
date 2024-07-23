import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, memo, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BottomSheet from '@/components/ui/bottom-sheet';
import Text from '@/components/ui/text';
import { DISCOUNT_SORT_OPTIONS } from '@/libs/sorts';

interface SalesSortBottomSheetProps {}

const SalesSortBottomSheet = memo(
  forwardRef<BottomSheetModal, SalesSortBottomSheetProps>(function SalesSortBottomSheet(
    {}: SalesSortBottomSheetProps,
    ref,
  ) {
    const { styles } = useStyles(stylesheet);

    const sortOptions = useMemo(() => {
      return Object.entries(DISCOUNT_SORT_OPTIONS).map(([key, sortOption], index) => {
        return <Text key={key}>{sortOption.text}</Text>;
      });
    }, []);

    return (
      <BottomSheet ref={ref} index={1} title="정렬 방법 변경">
        <View style={styles.container}>{sortOptions}</View>
      </BottomSheet>
    );
  }),
);

const stylesheet = createStyleSheet(theme => ({
  container: { flexDirection: 'column' },
}));

export default SalesSortBottomSheet;
