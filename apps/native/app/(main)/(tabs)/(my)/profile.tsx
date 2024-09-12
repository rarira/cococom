import { PortalHost } from '@gorhom/portal';
import { router } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DeleteUserDialog from '@/components/custom/dialog/delete-user';
import SignUpConfirmForm from '@/components/custom/form/signup/&confirm';
import ScreenContainerView from '@/components/custom/view/container/screen';
import Divider from '@/components/ui/divider';
import NavMenu from '@/components/ui/menu/nav';
import { PortalHostNames } from '@/constants';
import { useUserStore } from '@/store/user';

export default function ProfileScreen() {
  const { styles } = useStyles(stylesheet);
  const user = useUserStore(state => state.user);

  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (!user) router.navigate('/(my)');
  }, [user]);

  const handlePress = useCallback(() => setVisible(true), []);

  return (
    <ScreenContainerView withHeader>
      <SignUpConfirmForm update />
      <Divider style={styles.divider} />
      <NavMenu textProps={{ children: '회원 탈퇴' }} onPress={handlePress} />
      <PortalHost name={PortalHostNames.PROFILE} />
      <DeleteUserDialog
        portalHostName={PortalHostNames.PROFILE}
        visible={visible}
        setVisible={setVisible}
      />
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  divider: {
    marginVertical: theme.spacing.xl * 2,
  },
}));
