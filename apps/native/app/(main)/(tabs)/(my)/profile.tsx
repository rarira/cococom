import { router } from 'expo-router';
import { useLayoutEffect } from 'react';

import SignUpConfirmForm from '@/components/custom/form/signup/&confirm';
import ScreenContainerView from '@/components/custom/view/container/screen';
import { useUserStore } from '@/store/user';

export default function ProfileScreen() {
  const user = useUserStore(state => state.user);

  useLayoutEffect(() => {
    if (!user) router.navigate('/(my)');
  }, [user]);

  return (
    <ScreenContainerView withHeader>
      <SignUpConfirmForm update />
    </ScreenContainerView>
  );
}
