import { router } from 'expo-router';
import { useLayoutEffect } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ScreenContainerView from '@/components/custom/view/container/screen';
import Divider from '@/components/ui/divider';
import NavMenu from '@/components/ui/menu/nav';
import { useUserStore } from '@/store/user';

export default function ProfileScreen() {
  const { styles } = useStyles(stylesheet);
  const user = useUserStore(state => state.user);

  useLayoutEffect(() => {
    if (!user) router.navigate('/(my)');
  }, [user]);

  return (
    <ScreenContainerView withHeader>
      <Divider style={styles.divider} />
      <NavMenu textProps={{ children: '회원 탈퇴' }} onPress={() => {}} />
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  divider: {
    marginVertical: theme.spacing.xl * 2,
  },
}));
