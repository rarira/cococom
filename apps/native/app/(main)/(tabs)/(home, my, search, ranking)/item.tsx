import { PortalHost } from '@gorhom/portal';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { MaterialTabBar, TabBarProps, Tabs } from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import HeaderRightRelatedButton from '@/components/custom/button/header/right/related';
import ItemCommentTabView from '@/components/custom/tab-view/item/comment';
import ItemDiscountHistoryTabView from '@/components/custom/tab-view/item/discount-history';
import ItemMemoTabView from '@/components/custom/tab-view/item/memo';
import ItemDetailsHeaderInfoView from '@/components/custom/view/item-details/&header-info';
import ItemDetailsPagerWrapperView from '@/components/custom/view/item-details/&pager/&wrapper';
import { ItemDetailsTabNames, PortalHostNames } from '@/constants';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { useTransparentHeader } from '@/hooks/useTransparentHeader';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';
import Util from '@/libs/util';

const queryFn = (itemId: number, userId?: string) => () =>
  supabase.items.fetchItemsWithWishlistCount(itemId, userId, true);

export default function ItemScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const user = useUserStore(store => store.user);

  const { itemId, tab } = useLocalSearchParams<{ itemId: string; tab?: ItemDetailsTabNames }>();

  const { bottom } = useSafeAreaInsets();

  useHideTabBar();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.items.byId(+itemId, user?.id),
    queryFn: queryFn(+itemId, user?.id),
  });

  const headerRight = useCallback(() => {
    if (!data?.related_item_id) return null;
    return <HeaderRightRelatedButton item={data} />;
  }, [data]);

  useTransparentHeader({
    title: data?.itemName,
    headerBackButtonDisplayMode: 'minimal',
    headerRight,
  });

  const renderTabBar = useCallback(
    (props: TabBarProps) => {
      return (
        <MaterialTabBar
          {...props}
          scrollEnabled
          style={styles.tabBarContainer}
          labelStyle={styles.tabBarLabel}
          activeColor={theme.colors.typography}
          inactiveColor={`${theme.colors.typography}CC`}
          indicatorStyle={styles.tabBarIndictator}
        />
      );
    },
    [styles, theme],
  );

  const renderHeader = useCallback(() => {
    if (!data) return null;

    return (
      <View style={styles.headerContainer}>
        <ItemDetailsPagerWrapperView item={data} />
        <ItemDetailsHeaderInfoView item={data} />
      </View>
    );
  }, [data, styles.headerContainer]);

  if (error || !data || isLoading) return null;

  return (
    <View style={styles.container}>
      <Tabs.Container
        containerStyle={styles.tabsContainer(bottom)}
        renderTabBar={renderTabBar}
        renderHeader={renderHeader}
        allowHeaderOverscroll
        lazy={Util.isPlatform('ios')}
        initialTabName={tab}
      >
        <Tabs.Tab name={ItemDetailsTabNames.HISTORY} label={`할인 이력(${data.discounts?.length})`}>
          <Tabs.ScrollView>
            <ItemDiscountHistoryTabView discounts={data.discounts} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab
          name={ItemDetailsTabNames.COMMENT}
          label={`댓글${data.totalCommentCount ? `(${data.totalCommentCount})` : ''}`}
        >
          <ItemCommentTabView itemId={+itemId} totalCommentCount={data.totalCommentCount ?? 0} />
        </Tabs.Tab>
        <Tabs.Tab
          name={ItemDetailsTabNames.MEMO}
          label={`메모${data.totalMemoCount ? `(${data.totalMemoCount})` : ''}`}
        >
          <ItemMemoTabView itemId={+itemId} totalMemoCount={data.totalMemoCount ?? 0} />
        </Tabs.Tab>
        {/* TODO: 언제가 추가할 기능 
        <Tabs.Tab name={`구매기록(3)`}>
          <Tabs.ScrollView>
            <SecondRoute />
          </Tabs.ScrollView>
        </Tabs.Tab> */}
      </Tabs.Container>
      <PortalHost name={PortalHostNames.ITEM_DETAILS} />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: theme.colors.background,
  },
  tabsContainer: (bottom: number) => ({
    marginBottom: bottom,
    backgroundColor: theme.colors.background,
  }),
  tabBarContainer: {
    backgroundColor: theme.colors.cardBackground,
  },
  tabBarLabel: { fontSize: theme.fontSize.normal, fontWeight: 'semibold' },
  tabBarIndictator: { backgroundColor: theme.colors.tint3 },
  headerContainer: { backgroundColor: theme.colors.background },
}));
