import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface PagerViewNavigationProps {
  pageLength: number;
  activePage: number;
  onPress: (page: number) => void;
}

const PagerViewNavigation = memo(function PagerViewNavigation({
  pageLength,
  activePage,
  onPress,
}: PagerViewNavigationProps) {
  const { styles } = useStyles(stylesheet);

  console.log('rendering pager view navigation', activePage);
  return (
    <View style={styles.container}>
      {Array.from({ length: pageLength }).map((_, index) => (
        <Pressable key={index} onPress={() => onPress(index)}>
          <View style={styles.dot(index === activePage)} />
        </Pressable>
      ))}
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
    borderRadius: 9999,
    backgroundColor: `${theme.colors.shadow}88`,
  },
  dot: (selected: boolean) => ({
    width: theme.spacing.md,
    height: theme.spacing.md,
    backgroundColor: selected ? theme.colors.tint3 : 'white',
    borderRadius: theme.spacing.md / 2,
    borderColor: selected ? theme.colors.tint3 : theme.colors.typography,
  }),
}));

export default PagerViewNavigation;
