import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ArrowNavButton from '@/components/custom/button/arrow-nav';

interface ItemDetailsPagerNavViewProps {
  activePage: number;
  handleNavigateToPage: (page: number) => void;
  totalPages: number;
}

const ItemDetailsPagerNavView = memo(function ItemDetailsPagerNavView({
  activePage,
  handleNavigateToPage,
  totalPages,
}: ItemDetailsPagerNavViewProps) {
  const { styles, theme } = useStyles(stylesheet);

  const handleRightNav = useCallback(() => {
    handleNavigateToPage(activePage + 1);
  }, [activePage, handleNavigateToPage]);

  const handleLeftNav = useCallback(() => {
    handleNavigateToPage(activePage - 1);
  }, [activePage, handleNavigateToPage]);

  const iconProps = useMemo(
    () => ({ size: theme.fontSize.xl, color: theme.colors.typography }),
    [theme.fontSize.xl, theme.colors.typography],
  );

  return (
    <>
      {activePage < totalPages - 1 && (
        <View style={styles.arrowContainer('right')}>
          <ArrowNavButton direction="right" onPress={handleRightNav} iconProps={iconProps} />
        </View>
      )}
      {activePage > 0 && (
        <View style={styles.arrowContainer('left')}>
          <ArrowNavButton direction="left" onPress={handleLeftNav} iconProps={iconProps} />
        </View>
      )}
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  arrowContainer: (direction: 'left' | 'right') => ({
    position: 'absolute',
    [direction]: theme.spacing.md,
    justifyContent: 'center',
    top: '50%',
    transform: [{ translateY: -theme.fontSize.xxl / 2 }],
  }),
}));

export default ItemDetailsPagerNavView;
