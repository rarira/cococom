import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ScreenTitleText from '@/components/custom/text/screen-title';
import ScreenContainerView from '@/components/custom/view/container/screen';
import { useUserStore } from '@/store/user';

export default function MyScreen() {
  const { styles } = useStyles(stylesheet);

  const { user, profile } = useUserStore(state => ({ user: state.user, profile: state.profile }));

  return (
    <ScreenContainerView withBottomTabBar>
      {!user ? (
        <Link href="/auth/signin" asChild>
          <Pressable>
            <ScreenTitleText>로그인하세요</ScreenTitleText>
          </Pressable>
        </Link>
      ) : (
        <Link href="/profile">
          <View style={styles.welcomeTextContainer}>
            <ScreenTitleText style={styles.nicknameText}>{profile?.nickname}</ScreenTitleText>
            <ScreenTitleText>님 반갑습니다</ScreenTitleText>
          </View>
        </Link>
      )}
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  welcomeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nicknameText: {
    color: theme.colors.tint3,
  },
}));
