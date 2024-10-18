import { PortalHost } from '@gorhom/portal';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ContentStyle, FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CircularProgress from '@/components/core/progress/circular';
import AlltimeRankingListItemCard from '@/components/custom/card/list-item/alltime-ranking';
import { DiscountChannels, PortalHostNames } from '@/constants';
import { useAlltimeRankingQuery } from '@/hooks/alltime-ranking/useAlltimeRankingQuery';
import { AlltimeSortOption } from '@/libs/sort';

interface AlltimeRankingListProps {
  sortOption: AlltimeSortOption;
  channel: DiscountChannels;
  limit?: number;
  contentContainerStyle?: ContentStyle;
}

export default function AlltimeRankingList({
  sortOption,
  channel,
  limit,
  contentContainerStyle,
}: AlltimeRankingListProps) {
  const { styles } = useStyles(stylesheet);

  const { data, error, isLoading, queryKey, refreshing, handleRefresh } = useAlltimeRankingQuery(
    channel,
    sortOption,
    limit,
  );

  const tabBarHeight = useBottomTabBarHeight();

  const renderItem = useCallback(
    ({ item }: { item: NonNullable<typeof data>[number]; index: number }) => {
      return <AlltimeRankingListItemCard item={item} key={item.id} queryKey={queryKey} />;
    },
    [queryKey],
  );

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.seperatorStyle} />,
    [styles.seperatorStyle],
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
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={{
          ...styles.flashListContainer(tabBarHeight),
          ...contentContainerStyle,
        }}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <PortalHost name={PortalHostNames.RANKING} />
    </>
  );
}

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: (tabBarheight: number) => ({
    paddingHorizontal: theme.spacing.lg,
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
