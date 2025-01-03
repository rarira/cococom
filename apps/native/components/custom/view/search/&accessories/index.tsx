import { memo, useLayoutEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton from '@/components/core/button/icon';
import Checkbox, { CheckboxGroupViewProps } from '@/components/core/checkbox';
import SearchOptionCheckbox from '@/components/custom/checkbox/search-option';
import SearchHistoryView from '@/components/custom/view/search/&history';
import { SearchItemsOptions, SearchOptionValue } from '@/libs/search';
import { SearchItemOptionInfo } from '@/libs/sort/search';

interface SearchAccessoriesViewProps {
  checkboxGroupProps: CheckboxGroupViewProps;
  searchHistoryProps: any;
}

const SearchAccessoriesView = memo(function SearchAccessoriesView({
  checkboxGroupProps,
  searchHistoryProps,
}: SearchAccessoriesViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { styles, theme } = useStyles(stylesheet);

  useLayoutEffect(() => {
    if (searchHistoryProps.searchHistory?.length === 0) {
      setIsOpen(false);
    }
  }, [searchHistoryProps.searchHistory?.length]);

  const SearchItemCheckboxes = useMemo(() => {
    const searchItemsOptions = Object.entries(SearchItemsOptions(theme)) as [
      SearchOptionValue,
      SearchItemOptionInfo,
    ][];

    return (
      <>
        {searchItemsOptions.map(([key, value], _index) => (
          <SearchOptionCheckbox
            key={key}
            option={key}
            value={value}
            indicatorStyle={
              key === 'item_id'
                ? styles.checkboxProductNumberIndicator
                : styles.checkboxOnSaleIndicator
            }
          />
        ))}
      </>
    );
  }, [styles.checkboxOnSaleIndicator, styles.checkboxProductNumberIndicator, theme]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Checkbox.Group {...checkboxGroupProps} style={styles.checkboxGroup}>
          {SearchItemCheckboxes}
        </Checkbox.Group>
        {searchHistoryProps.searchHistory?.length > 0 ? (
          <IconButton
            iconProps={{
              font: { type: 'Ionicon', name: isOpen ? 'chevron-down' : 'chevron-forward' },
              size: theme.fontSize.sm,
              color: theme.colors.typography,
              style: styles.collapsibleIcon,
            }}
            onPress={() => setIsOpen(value => !value)}
            text="검색 기록"
          />
        ) : null}
      </View>
      {isOpen ? <SearchHistoryView {...searchHistoryProps} /> : null}
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  checkboxProductNumberIndicator: (checked: boolean) => ({
    backgroundColor: checked ? SearchItemsOptions(theme)['item_id'].indicatorColor : 'transparent',
    borderColor: checked
      ? SearchItemsOptions(theme)['item_id'].indicatorColor
      : theme.colors.typography,
  }),
  checkboxOnSaleIndicator: (checked: boolean) => ({
    backgroundColor: checked ? SearchItemsOptions(theme)['on_sale'].indicatorColor : 'transparent',
    borderColor: checked
      ? SearchItemsOptions(theme)['on_sale'].indicatorColor
      : theme.colors.typography,
  }),
  collapsibleIcon: {
    paddingTop: theme.spacing.sm,
  },
}));

export default SearchAccessoriesView;
