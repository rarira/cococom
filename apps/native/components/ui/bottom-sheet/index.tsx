import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types';
import { useHeaderHeight } from '@react-navigation/elements';
import { forwardRef, memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ModalCloseButton from '@/components/custom/button/modal-close';
import Text from '@/components/ui/text';

interface BottomSheetProps
  extends Omit<BottomSheetModalProps, 'children'>,
    Pick<BottomSheetViewProps, 'children'> {
  title?: string;
  backdropDismiss?: boolean;
  showCloseButton?: boolean;
}

export default memo(
  forwardRef<BottomSheetModal, BottomSheetProps>(function BottomSheet(
    { title, children, backdropDismiss, showCloseButton = true, ...restProps }: BottomSheetProps,
    ref,
  ) {
    const { styles } = useStyles(stylesheet);

    const { bottom: bottomInset } = useSafeAreaInsets();

    const headerHeight = useHeaderHeight();

    const snapPoints = useMemo(() => ['25%'], []);

    const backdropComponent = useCallback(
      (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} />,
      [],
    );

    const handleComponent = useCallback(
      (props: BottomSheetHandleProps) => (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <ModalCloseButton onPress={() => ref.current?.dismiss()} show={showCloseButton} />
        </View>
      ),
      [ref, showCloseButton, styles.title, styles.titleContainer, title],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDismissOnClose
        enablePanDownToClose
        backgroundStyle={styles.background}
        enableDynamicSizing
        topInset={headerHeight}
        backdropComponent={backdropComponent}
        handleComponent={handleComponent}
        {...restProps}
      >
        <BottomSheetView style={styles.container(bottomInset)}>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  }),
);

const stylesheet = createStyleSheet(theme => ({
  container: (bottomInset: number) => ({
    flexDirection: 'column',
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
    backgroundColor: theme.colors.modalBackground,
    paddingBottom: bottomInset,
  }),
  background: {
    backgroundColor: theme.colors.modalBackground,
  },

  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.tint,
  },
}));
