import { PortalHost } from '@gorhom/portal';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ContentStyle, FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CircularProgress from '@/components/core/progress/circular';
import DiscountListItemCard from '@/components/custom/card/list-item/discount';
import { DiscountChannels, PortalHostNames } from '@/constants';
import { useDiscountedRankingListQuery } from '@/hooks/discount/useDiscountedRankingListQuery';
import { useDiscountListQuery } from '@/hooks/discount/useDiscountListQuery';
import { DiscountSortOption } from '@/libs/sort';

interface DiscountListProps {
  sortOption: DiscountSortOption;
  channel: DiscountChannels;
  limit?: number;
  contentContainerStyle?: ContentStyle;
  portalHostName?: PortalHostNames;
  refreshable?: boolean;
  ranked?: boolean;
}

const NumberOfColumns = 1;

export default function DiscountList({
  sortOption,
  channel,
  limit,
  contentContainerStyle,
  portalHostName = PortalHostNames.HOME,
  refreshable,
  ranked,
}: DiscountListProps) {
  const { styles } = useStyles(stylesheet);

  const hook = ranked ? useDiscountedRankingListQuery : useDiscountListQuery;

  const { data, error, isLoading, queryKey, refreshing, handleRefresh } = hook({
    sortOption,
    limit,
    channel,
  });

  const tabBarHeight = useBottomTabBarHeight();

  const renderItem = useCallback(
    ({ item }: { item: NonNullable<typeof data>[number] }) => {
      return (
        <DiscountListItemCard
          discount={item}
          numColumns={NumberOfColumns}
          key={item.id}
          queryKeyOfList={queryKey}
          portalHostName={portalHostName}
        />
      );
    },
    [portalHostName, queryKey],
  );

  if (error) return null;

  if (isLoading) {
    return <CircularProgress style={styles.loadinProgress} />;
  }

  return (
    <>
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={600}
        keyExtractor={item => item?.id.toString()}
        numColumns={NumberOfColumns}
        ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
        contentContainerStyle={{
          ...styles.flashListContainer(NumberOfColumns > 1, tabBarHeight),
          ...contentContainerStyle,
        }}
        {...(refreshable && { onRefresh: handleRefresh, refreshing })}
      />
      <PortalHost name={portalHostName} />
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
  loadinProgress: {
    flex: 1,
    marginTop: theme.spacing.xl * 3,
  },
}));
