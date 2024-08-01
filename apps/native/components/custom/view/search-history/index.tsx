import { memo, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Chip from '@/components/ui/chip';
import { useSearchHistory } from '@/hooks/search/useSearchHistory';
import { SearchHistory, SearchItemsOptions } from '@/libs/search';

interface SearchHistoryViewProps
  extends Omit<ReturnType<typeof useSearchHistory>, 'addSearchHistory'> {
  onPressSearchHistory: (searchHistory: SearchHistory) => void;
}

const SearchHistoryView = memo(function SearchHistoryView({
  onPressSearchHistory,
  clearSearchHistories,
  removeSearchHistory,
  searchHistory,
}: SearchHistoryViewProps) {
  const { styles, theme } = useStyles(stylesheet);

  const SearchHistoryChips = useMemo(() => {
    return (
      <>
        {searchHistory.map((history, index) => {
          return (
            <Pressable
              key={`${history.keyword}_${index}`}
              onPress={() => onPressSearchHistory(history)}
              onLongPress={() => removeSearchHistory(history.hash)}
            >
              <Chip
                text={history.keyword}
                style={styles.chip}
                textProps={{ style: styles.chipText }}
                renderSuffix={
                  history.options.length > 0
                    ? () => (
                        <View style={styles.chipSuffixContainer}>
                          {history.options.map((option, index) => (
                            <View
                              key={option}
                              style={styles.chipSuffixCircle(
                                SearchItemsOptions(theme)[option].indicatorColor,
                              )}
                            />
                          ))}
                        </View>
                      )
                    : undefined
                }
              />
            </Pressable>
          );
        })}
      </>
    );
  }, [onPressSearchHistory, removeSearchHistory, searchHistory, styles, theme]);

  return <View style={styles.container}>{SearchHistoryChips}</View>;
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  chip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.typography,
    padding: theme.spacing.sm,
  },
  chipText: {
    color: theme.colors.typography,
  },
  chipSuffixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  chipSuffixCircle: (backgroundColor: string) => ({
    backgroundColor,
    width: theme.spacing.md,
    height: theme.spacing.md,
    borderRadius: 9999,
  }),
}));

export default SearchHistoryView;
