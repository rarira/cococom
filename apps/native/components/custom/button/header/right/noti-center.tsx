import { Link } from 'expo-router';
import { memo, useEffect } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useMMKVObject } from 'react-native-mmkv';

import { STORAGE_KEYS, TODAYS_NOTIFICATION_DATA } from '@/libs/mmkv';
import Button from '@/components/core/button';
import Icon from '@/components/core/icon';
import Text from '@/components/core/text';
import { useBellAnimation } from '@/hooks/animation/useBellAnimation';

// NOTE: This is a dummy data for testing
const a = {
  unread: true,
  '2024-12-05': [
    {
      wishlistId: 'e0fb47ca-843a-41a7-97b0-b7a57b994d2f',
      id: 190821,
      itemId: '509119_online',
      itemName: '썬키스트 견과 ３종세트 25g x 60봉',
      is_online: true,
      unread: false,
    },
    {
      wishlistId: 'fb574897-9f17-47b0-bb91-3af56746b8e2',
      id: 190393,
      itemId: '670356_online',
      itemName: '웨버 제네시스 II 가스 그릴 패키지 EPX-335',
      is_online: true,
      unread: false,
    },
    {
      wishlistId: '0957355a-210e-4523-9908-a5e0d9e73ef9',
      id: 187013,
      itemId: '671578_online',
      itemName: '알뜨레노띠 포르마 매트리스 - 라지킹',
      is_online: true,
      unread: false,
    },
    {
      wishlistId: 'f1b10d48-7a9c-4ba2-8a3d-012832bc0fec',
      id: 186992,
      itemId: '674688_online',
      itemName: 'HTL 통가죽 리클라이너 소파 4인',
      is_online: true,
      unread: false,
    },
  ],
  '2024-12-09': [
    {
      wishlistId: 'e0fb47ca-843a-41a7-97b0-b7a57b994d2f',
      id: 190821,
      itemId: '509119_online',
      itemName: '썬키스트 견과 ３종세트 25g x 60봉',
      is_online: true,
      unread: true,
    },
    {
      wishlistId: 'fb574897-9f17-47b0-bb91-3af56746b8e2',
      id: 190393,
      itemId: '670356_online',
      itemName: '웨버 제네시스 II 가스 그릴 패키지 EPX-335',
      is_online: true,
      unread: true,
    },
    {
      wishlistId: '0957355a-210e-4523-9908-a5e0d9e73ef9',
      id: 187013,
      itemId: '671578_online',
      itemName: '알뜨레노띠 포르마 매트리스 - 라지킹',
      is_online: true,
      unread: true,
    },
    {
      wishlistId: 'f1b10d48-7a9c-4ba2-8a3d-012832bc0fec',
      id: 186992,
      itemId: '674688_online',
      itemName: 'HTL 통가죽 리클라이너 소파 4인',
      is_online: true,
      unread: true,
    },
  ],
  '2024-12-10': [
    {
      wishlistId: 'e0fb47ca-843a-41a7-97b0-b7a57b994d2f',
      id: 190821,
      itemId: '509119_online',
      itemName: '썬키스트 견과 ３종세트 25g x 60봉',
      is_online: true,
      unread: true,
    },
    {
      wishlistId: 'fb574897-9f17-47b0-bb91-3af56746b8e2',
      id: 190393,
      itemId: '670356_online',
      itemName: '웨버 제네시스 II 가스 그릴 패키지 EPX-335',
      is_online: true,
      unread: true,
    },
    {
      wishlistId: '0957355a-210e-4523-9908-a5e0d9e73ef9',
      id: 187013,
      itemId: '671578_online',
      itemName: '알뜨레노띠 포르마 매트리스 - 라지킹',
      is_online: true,
      unread: true,
    },
    {
      wishlistId: 'f1b10d48-7a9c-4ba2-8a3d-012832bc0fec',
      id: 186992,
      itemId: '674688_online',
      itemName: 'HTL 통가죽 리클라이너 소파 4인',
      is_online: true,
      unread: true,
    },
  ],
};

const HeaderRightNotiCenterButton = memo(function HeaderRightNotiCenterButton() {
  const { styles, theme } = useStyles(stylesheet);

  const [todaysNotifications, setTodaysNotifications] = useMMKVObject<TODAYS_NOTIFICATION_DATA>(
    STORAGE_KEYS.TODAYS_NOTIFICATION,
  );

  const { animatedStyle: animatedIconStyle } = useBellAnimation({
    showAnimation: !!todaysNotifications?.unread,
  });

  // useEffect(() => {
  //   setTodaysNotifications(a);
  // }, [setTodaysNotifications]);

  return (
    <Link href={'/noti-center'} asChild>
      <Button style={state => styles.button(state.pressed)}>
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
            새로 추가된 관심 상품 할인
          </Text>
        </View>
      </Button>
    </Link>
  );
});

const stylesheet = createStyleSheet(theme => ({
  button: (pressed: boolean) => ({
    opacity: pressed ? 0.5 : 1,
    borderColor: 'red',
    borderWidth: 1,
    // marginLeft: theme.spacing.md,
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
