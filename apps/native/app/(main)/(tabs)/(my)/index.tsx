import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ScreenTitleText from '@/components/custom/text/screen-title';
import ScreenContainerView from '@/components/custom/view/container/screen';
import Icon from '@/components/ui/icon';
import Text from '@/components/ui/text';
import { useUserStore } from '@/store/user';

export default function MyScreen() {
  const { styles, theme } = useStyles(stylesheet);

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
        <View style={styles.welcomeTextContainer}>
          <ScreenTitleText style={styles.nicknameText}>{profile?.nickname}</ScreenTitleText>
          <ScreenTitleText style={styles.suffixText}>님 반갑습니다</ScreenTitleText>
          <Link href="/profile" asChild>
            <Pressable style={styles.profileLinkContainer}>
              <Text style={styles.profileText}>프로필</Text>
              <Icon
                font={{ type: 'MaterialIcon', name: 'chevron-right' }}
                size={theme.fontSize.xl}
                color={theme.colors.link}
              />
            </Pressable>
          </Link>
        </View>
      )}
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  welcomeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  nicknameText: {
    color: theme.colors.tint3,
    marginBottom: 0,
  },
  suffixText: {
    marginBottom: 0,
  },
  profileLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    marginLeft: theme.spacing.md,
  },
  profileText: {
    color: theme.colors.link,
    fontSize: theme.fontSize.sm,
    marginRight: -theme.spacing.sm,
  },
}));
