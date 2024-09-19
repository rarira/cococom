import { PortalHost } from '@gorhom/portal';
import { router } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DeleteUserDialog from '@/components/custom/dialog/delete-user';
import SignUpConfirmForm from '@/components/custom/form/signup/&confirm';
import SectionText from '@/components/custom/text/section';
import ScreenContainerView from '@/components/custom/view/container/screen';
import RowMenu from '@/components/ui/menu/row';
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

  console.log('ProfileScreen', user);

  const isEmailProvider = user?.app_metadata.provider === 'email';

  return (
    <ScreenContainerView withHeader style={styles.container}>
      <SectionText style={styles.sectionText} isFirstSection>
        프로필 변경
      </SectionText>
      <SignUpConfirmForm update style={styles.form} />
      <SectionText style={styles.sectionText}>회원 관리</SectionText>
      {isEmailProvider && (
        <RowMenu.Root
          type="nav"
          onPress={() => console.log('go change password')}
          style={styles.menu}
        >
          <RowMenu.Text>비밀번호 변경</RowMenu.Text>
          <RowMenu.NavButton />
        </RowMenu.Root>
      )}
      <RowMenu.Root type="nav" onPress={handlePress} style={styles.menu}>
        <RowMenu.Text>회원 탈퇴</RowMenu.Text>
        <RowMenu.NavButton />
      </RowMenu.Root>
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
  container: { paddingHorizontal: 0 },
  form: {
    paddingHorizontal: theme.screenHorizontalPadding,
    backgroundColor: theme.colors.modalBackground,
    paddingVertical: theme.spacing.lg,
  },
  sectionText: {
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  menu: {
    paddingHorizontal: theme.screenHorizontalPadding,
  },
}));
