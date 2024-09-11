import { router } from 'expo-router';
import { useLayoutEffect } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ScreenContainerView from '@/components/custom/view/container/screen';
import Text from '@/components/ui/text';
import { useUserStore } from '@/store/user';
export default function ProfileScreen() {
  const { styles } = useStyles(stylesheet);
  const user = useUserStore(state => state.user);

  useLayoutEffect(() => {
    if (!user) router.navigate('/(my)');
  }, [user]);

  return (
    <ScreenContainerView withHeader>
      <Text>profile</Text>
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number) => ({
    flex: 1,
    paddingHorizontal: theme.screenHorizontalPadding,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.lg,
    // justifyContent: 'flex-start',
  }),
}));
