import { PortalHost } from '@gorhom/portal';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { PortalHostNames } from '@/constants';
import { useDiscountListQuery } from '@/hooks/useDiscountListQuery';
import { DISCOUNT_SORT_OPTIONS } from '@/libs/sort';

import DiscountListItemCard from '../../card/list-item/discount';

interface DiscountListProps {
  currentSort: keyof typeof DISCOUNT_SORT_OPTIONS;
}

const NumberOfColumns = 1;

export default function DiscountList({ currentSort }: DiscountListProps) {
  const { styles } = useStyles(stylesheet);

  const { data, error, isLoading } = useDiscountListQuery(currentSort);

  const tabBarHeight = useBottomTabBarHeight();

  const renderItem = useCallback(
    ({ item }: { item: NonNullable<typeof data>[number]; index: number }) => {
      return <DiscountListItemCard discount={item} numColumns={NumberOfColumns} key={item.id} />;
    },
    [],
  );

  if (error || !data || isLoading) return null;

  return (
    <>
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={600}
        keyExtractor={item => item?.id.toString()}
        numColumns={NumberOfColumns}
        ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
        contentContainerStyle={styles.flashListContainer(NumberOfColumns > 1, tabBarHeight)}
      />
      <PortalHost name={PortalHostNames.HOME} />
    </>
  );
}

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: (isMultiColumn: boolean, tabBarheight: number) => ({
    paddingHorizontal: isMultiColumn ? theme.screenHorizontalPadding : theme.spacing.lg,
    paddingBottom: tabBarheight + theme.spacing.xl,
  }),
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
}));
