import { useLayoutEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';

import ScreenContainerView from '@/components/custom/view/container/screen';
import Text from '@/components/core/text';
import CloseButton from '@/components/custom/button/close';
import Util from '@/libs/util';
import Button from '@/components/core/button';
import { useTodaysNotifications } from '@/hooks/notification/useTodaysNotifications';
import NotificationSectionList from '@/components/custom/list/notification/&section';

export default function NotiCenterScreen() {
  const { styles } = useStyles(stylesheet);

  const navigation = useNavigation();

  const { setTodaysNotifications, sectionedNotifications } = useTodaysNotifications();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={() => router.dismiss()} />,
      headerRight: () => (
        //TODO: https://github.com/software-mansion/react-native-screens/issues/2219#issuecomment-2481628312
        <Button
          {...(Util.isPlatform('android')
            ? { onPressOut: () => setTodaysNotifications(undefined) }
            : { onPress: () => setTodaysNotifications(undefined) })}
        >
          <Text style={styles.deleteText}>모두 삭제</Text>
        </Button>
      ),
    } as any);
  }, [navigation, setTodaysNotifications, styles.deleteText]);

  console.log({ sectionedNotifications });
  return (
    <ScreenContainerView withHeader>
      <View style={styles.header}>
        <Text type="subtitle" style={styles.subTitle}>
          등록하신 관심 상품이 할인을 개시할 경우 날짜별로 알려드립니다. 일주일이 지나면 자동으로
          삭제됩니다.
        </Text>
      </View>
      <NotificationSectionList data={sectionedNotifications} />
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
}));
