import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Alert, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useMMKVObject } from 'react-native-mmkv';

import { STORAGE_KEYS, TODAYS_NOTIFICATION_DATA } from '@/libs/mmkv';
import Button from '@/components/core/button';
import Icon from '@/components/core/icon';
import Text from '@/components/core/text';
import { useBellAnimation } from '@/hooks/animation/useBellAnimation';
import { useNotificationSetting } from '@/hooks/notification/useNotificationSetting';
import { useUserStore } from '@/store/user';
import Util from '@/libs/util';

const HeaderRightNotiCenterButton = memo(function HeaderRightNotiCenterButton() {
  const { styles, theme } = useStyles(stylesheet);

  const user = useUserStore(state => state.user);

  const { granted } = useNotificationSetting(user);

  const [todaysNotifications] = useMMKVObject<TODAYS_NOTIFICATION_DATA>(
    STORAGE_KEYS.TODAYS_NOTIFICATION,
  );

  const { animatedStyle: animatedIconStyle } = useBellAnimation({
    showAnimation: !!todaysNotifications?.unread,
  });

  const handlePress = useCallback(() => {
    if (granted || Util.isDevice() || Util.isDevClient()) {
      router.push('/noti-center');
    } else {
      Alert.alert(
        '알림 수신 허용 필요',
        '새로운 업데이트 알림을 받으실 수 없어요. 설정에서 알림 수신으로 변경해 주세요',
        [
          {
            text: '취소',
            onPress: () => null,
            style: 'cancel',
          },
          { text: '설정 변경', onPress: () => router.navigate('/settings') },
        ],
      );
    }
  }, [granted]);

  if (!user) return null;

  return (
    <Button style={state => styles.button(state.pressed)} onPress={handlePress}>
      <View style={styles.container}>
        <Animated.View style={animatedIconStyle}>
          <Icon
            {...{
              size: theme.fontSize.lg,
              color: todaysNotifications?.unread ? theme.colors.tint3 : theme.colors.typography,
              font: {
                type: 'Ionicon',
                name: 'notifications',
              },
            }}
          />
        </Animated.View>
        <Text type="defaultSemiBold" style={styles.text(!!todaysNotifications?.unread)}>
          관심상품 할인 알림
        </Text>
      </View>
    </Button>
  );
});

const stylesheet = createStyleSheet(theme => ({
  button: (pressed: boolean) => ({
    opacity: pressed ? 0.5 : 1,
  }),
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  text: (hasNewNoti: boolean) => ({
    fontSize: theme.fontSize.normal,
    lineHeight: theme.fontSize.normal * 1.5,
    color: hasNewNoti ? theme.colors.tint3 : theme.colors.typography,
  }),
}));

export default HeaderRightNotiCenterButton;
