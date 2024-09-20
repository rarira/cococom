import { memo, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton from '@/components/core/button/icon';
import Chip from '@/components/core/chip';
import Divider from '@/components/core/divider';
import { useSearchHistory } from '@/hooks/search/useSearchHistory';
import { SearchHistory, SearchItemsOptions } from '@/libs/search';

export interface SearchHistoryViewProps
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

  if (searchHistory.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Divider />
      <View style={styles.clearAllButtonContainer}>
        <IconButton
          iconProps={{
            font: { type: 'MaterialIcon', name: 'clear' },
            color: theme.colors.alert,
            style: { paddingTop: theme.spacing.sm },
          }}
          onPress={clearSearchHistories}
          text="검색 기록 모두 삭제"
          textStyle={styles.clearAllButtonText}
        />
      </View>
      <View style={styles.chipContainer}>{SearchHistoryChips}</View>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: theme.spacing.sm,
  },
  clearAllButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  clearAllButtonText: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
    color: theme.colors.alert,
    fontWeight: 'normal',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  chip: {
    backgroundColor: theme.colors.lightShadow,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm / 2,
  },
  chipText: {
    color: theme.colors.typography,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
    fontWeight: 'normal',
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
    borderRadius: theme.spacing.md / 2,
  }),
}));

export default SearchHistoryView;
