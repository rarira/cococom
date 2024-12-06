import { Link } from 'expo-router';
import { memo, useEffect, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { storage, STORAGE_KEYS } from '@/libs/mmkv';
import Button from '@/components/core/button';
import Icon from '@/components/core/icon';
import Text from '@/components/core/text';
import { useBellAnimation } from '@/hooks/animation/useBellAnimation';

const HeaderRightNotiCenterButton = memo(function HeaderRightNotiCenterButton() {
  const { styles, theme } = useStyles(stylesheet);

  const [hasNewNoti, setHasNewNoti] = useState<boolean>(false);

  useEffect(() => {
    const todaysNotification = storage.getString(STORAGE_KEYS.TODAYS_NOTIFICATION);
    if (todaysNotification) {
      setHasNewNoti(true);
    } else {
      setHasNewNoti(false);
    }
  }, []);

  const { animatedStyle: animatedIconStyle } = useBellAnimation({ showAnimation: hasNewNoti });

  console.log('hasNewNoti', hasNewNoti);
  return (
    <Link href={'/noti-center'} asChild>
      <Button style={state => styles.button(state.pressed)}>
        <View style={styles.container}>
          <Animated.View style={animatedIconStyle}>
            <Icon
              {...{
                size: theme.fontSize.lg,
                color: hasNewNoti ? theme.colors.tint3 : theme.colors.typography,
                font: {
                  type: 'Ionicon',
                  name: 'notifications',
                },
              }}
            />
          </Animated.View>
          <Text type="defaultSemiBold" style={styles.text(hasNewNoti)}>
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
