import { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button from '@/components/core/button';

interface PageDotNavButtonProps {
  numberOfPages: number;
  activePage: number;
  dotSize?: number;
  onPressDot?: (page: number) => void;
  style?: ViewStyle;
}

const PageDotNavButton = memo(function PageDotNavButton({
  numberOfPages,
  activePage,
  dotSize,
  onPressDot,
  style,
}: PageDotNavButtonProps) {
  const { styles } = useStyles(stylesheet);

  const DotContainer = onPressDot ? Button : View;

  return (
    <View style={[styles.container(dotSize), style]}>
      {Array.from({ length: numberOfPages }, (_, i) => (
        <DotContainer
          key={i}
          style={styles.dot(i === activePage, dotSize)}
          onPress={() => onPressDot?.(i)}
        />
      ))}
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: (dotSize: number = theme.spacing.lg) => ({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: dotSize,
  }),
  dot: (active: boolean, dotSize: number = theme.spacing.lg) => ({
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: active ? theme.colors.tint : theme.colors.lightShadow,
  }),
}));

export default PageDotNavButton;
