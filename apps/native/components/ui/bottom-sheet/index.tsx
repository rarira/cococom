import { BottomSheetModal, BottomSheetModalProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types';
import { useHeaderHeight } from '@react-navigation/elements';
import { forwardRef, memo, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface BottomSheetProps
  extends Omit<BottomSheetModalProps, 'children'>,
    Pick<BottomSheetViewProps, 'children'> {}

export default memo(
  forwardRef<BottomSheetModal, BottomSheetProps>(function BottomSheet(
    { children, ...restProps }: BottomSheetProps,
    ref,
  ) {
    const { styles } = useStyles(stylesheet);

    const { bottom: bottomInset } = useSafeAreaInsets();

    const headerHeight = useHeaderHeight();

    const snapPoints = useMemo(() => ['25%'], []);

    return (
      <BottomSheetModal
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        enableDismissOnClose
        backgroundStyle={styles.background}
        enableDynamicSizing
        topInset={headerHeight}
        handleIndicatorStyle={styles.handleIndicator}
        {...restProps}
      >
        <BottomSheetView style={styles.container(bottomInset)}>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  }),
);

const stylesheet = createStyleSheet(theme => ({
  container: (bottomInset: number) => ({
    padding: theme.spacing.xl,
    justifyContent: 'center',
    backgroundColor: theme.colors.modalBackground,
    paddingBottom: bottomInset,
  }),
  background: {
    backgroundColor: theme.colors.modalBackground,
  },
  handleIndicator: {
    backgroundColor: theme.colors.tint,
  },
}));
