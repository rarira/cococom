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
import EmptyList from '@/components/custom/list/empty';

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

  const { data, error, isLoading, refreshing, handleRefresh } = hook({
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
          portalHostName={portalHostName}
        />
      );
    },
    [portalHostName],
  );

  if (error) return null;

  if (isLoading) {
    return <CircularProgress style={styles.loadinProgress(tabBarHeight)} />;
  }

  return (
    <>
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={110}
        keyExtractor={item => item?.id.toString()}
        numColumns={NumberOfColumns}
        ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
        contentContainerStyle={{
          ...styles.flashListContainer(NumberOfColumns > 1, tabBarHeight),
          ...contentContainerStyle,
        }}
        ListEmptyComponent={() => (
          <EmptyList
            text={`할인 중인 상품이 없습니다.\n다른 조건으로 검색해 보세요`}
            style={styles.emptyList}
          />
        )}
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
    paddingTop: theme.spacing.md,
  }),
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
  loadinProgress: (tabBarHeight: number) => ({
    flex: 1,
    marginBottom: tabBarHeight,
  }),
  emptyList: {
    paddingTop: theme.spacing.xl * 3,
  },
}));
