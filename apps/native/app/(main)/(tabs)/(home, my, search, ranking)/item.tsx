import { PortalHost } from '@gorhom/portal';
import { useQuery } from '@tanstack/react-query';
import { Link, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { MaterialTabBar, TabBarProps, Tabs } from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import ItemCommentTabView from '@/components/custom/tab-view/item/comment';
import ItemDiscountHistoryTabView from '@/components/custom/tab-view/item/discount-history';
import ItemMemoTabView from '@/components/custom/tab-view/item/memo';
import ItemDetailsHeaderInfoView from '@/components/custom/view/item-details/&header-info';
import ItemDetailsPagerWrapperView from '@/components/custom/view/item-details/&pager/&wrapper';
import { PortalHostNames } from '@/constants';
import { useHideTabBar } from '@/hooks/useHideTabBar';
import { useTransparentHeader } from '@/hooks/useTransparentHeader';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useListQueryKeyStore } from '@/store/list-query-key';
import { useUserStore } from '@/store/user';

const queryFn = (itemId: number, userId?: string) => () =>
  supabase.fetchItemsWithWishlistCount(itemId, userId, true);

export default function ItemScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const user = useUserStore(store => store.user);
  const [setQueryKeyOfList, setPageIndexOfInfinteList] = useListQueryKeyStore(state => [
    state.setQueryKeyOfList,
    state.setPageIndexOfInfinteList,
  ]);
  const { itemId } = useLocalSearchParams();

  const { bottom } = useSafeAreaInsets();

  useHideTabBar();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.items.byId(+itemId, user?.id),
    queryFn: queryFn(+itemId, user?.id),
  });

  const headerRight = useCallback(() => {
    if (!data?.related_item_id) return null;
    return (
      <Link href={`/item?itemId=${data.related_item_id}`} asChild>
        <Pressable>
          <Text style={styles.headerRightText} numberOfLines={2}>
            {(data.is_online ? '오프라인' : '온라인') + '\n상품 보기'}
          </Text>
        </Pressable>
      </Link>
    );
  }, [data?.is_online, data?.related_item_id, styles.headerRightText]);

  useTransparentHeader({
    title: data?.itemName,
    headerBackTitleVisible: false,
    headerRight,
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        setQueryKeyOfList(null);
        setPageIndexOfInfinteList(null);
      };
    }, [setPageIndexOfInfinteList, setQueryKeyOfList]),
  );

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
        lazy={Platform.OS === 'ios'}
      >
        <Tabs.Tab name="history" label={`할인 이력(${data.discounts?.length})`}>
          <Tabs.ScrollView>
            <ItemDiscountHistoryTabView discounts={data.discounts} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab
          name="comment"
          label={`댓글${data.totalCommentCount ? `(${data.totalCommentCount})` : ''}`}
        >
          <ItemCommentTabView itemId={+itemId} />
        </Tabs.Tab>
        <Tabs.Tab
          name="memo"
          label={`메모${data.totalMemoCount ? `(${data.totalMemoCount})` : ''}`}
        >
          <ItemMemoTabView itemId={+itemId} />
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
  headerRightText: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.2,
    maxWidth: 50,
    textAlign: 'center',
    color: theme.colors.tint3,
    fontWeight: 'bold',
  },
}));
