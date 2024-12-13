import { useLayoutEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import ScreenContainerView from '@/components/custom/view/container/screen';
import Text from '@/components/core/text';
import CloseButton from '@/components/custom/button/close';
import Util from '@/libs/util';
import Button from '@/components/core/button';
import { useTodaysNotifications } from '@/hooks/notification/useTodaysNotifications';
import NotificationSectionList from '@/components/custom/list/notification/&section';
import { queryKeys } from '@/libs/react-query';
import { useUserStore } from '@/store/user';
import { supabase } from '@/libs/supabase';

export default function NotiCenterScreen() {
  const { styles } = useStyles(stylesheet);

  const navigation = useNavigation();

  const user = useUserStore(state => state.user);

  const { setTodaysNotifications, sectionedNotifications } = useTodaysNotifications();

  const { data: wishlistCount } = useQuery({
    queryKey: queryKeys.wishlists.count({ userId: user!.id }),
    queryFn: () => supabase.wishlists.getMyWishlistItemsCount({ userId: user!.id }),
    enabled: !!user,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={() => router.dismiss()} />,
      headerRight: () =>
        sectionedNotifications.length > 0 ? (
          //TODO: https://github.com/software-mansion/react-native-screens/issues/2219#issuecomment-2481628312
          <Button
            {...(Util.isPlatform('android')
              ? { onPressOut: () => setTodaysNotifications(undefined) }
              : { onPress: () => setTodaysNotifications(undefined) })}
          >
            <Text style={styles.deleteText}>모두 삭제</Text>
          </Button>
        ) : undefined,
    } as any);
  }, [navigation, sectionedNotifications.length, setTodaysNotifications, styles.deleteText]);

  return (
    <ScreenContainerView withHeader>
      {wishlistCount !== null ? (
        <>
          <View style={styles.header}>
            <Text type="subtitle" style={styles.subTitle}>
              등록하신 관심 상품이 할인을 개시할 경우 날짜별로 알려드립니다. 일주일이 지나면
              자동으로 삭제됩니다.
            </Text>
          </View>
          <NotificationSectionList data={sectionedNotifications} />
        </>
      ) : (
        <View style={styles.noWishlistContainer}>
          <Text
            style={styles.noWishlistText}
          >{`상품 목록 화면, 상품 상세 화면에서\n하트 모양의 관심 상품 등록 버튼을 눌러\n관심 상품을 등록해 두세요\n\n추후 해당 관심 상품이 할인을 개시하면\n푸시 알림과 함께 알려드릴게요`}</Text>
        </View>
      )}
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  header: {
    paddingTop: theme.spacing.md,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: theme.fontSize.normal,
    marginBottom: theme.spacing.lg,
  },
  deleteText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.alert,
    lineHeight: theme.fontSize.sm * 1.5,
  },
  noWishlistContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: theme.spacing.xl * 3,
    alignItems: 'center',
  },
  noWishlistText: {
    fontSize: theme.fontSize.normal,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.tint3,
  },
}));
