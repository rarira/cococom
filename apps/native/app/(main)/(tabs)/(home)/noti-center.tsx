import { useLayoutEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ScreenContainerView from '@/components/custom/view/container/screen';
import Text from '@/components/core/text';
import CloseButton from '@/components/custom/button/close';
import Util from '@/libs/util';
import Button from '@/components/core/button';
import { useTodaysNotifications } from '@/hooks/notification/useTodaysNotifications';

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
      <Text>{JSON.stringify(sectionedNotifications, null, 2)}</Text>
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  deleteText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.alert,
    lineHeight: theme.fontSize.sm * 1.5,
  },
}));
