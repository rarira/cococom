import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ScreenTitleText from '@/components/custom/text/screen-title';
import ScreenContainerView from '@/components/custom/view/container/screen';
import IconButton from '@/components/ui/button/icon';
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
        <View style={styles.header}>
          <View style={styles.welcomeTextContainer}>
            <ScreenTitleText style={styles.nicknameText}>{profile?.nickname}</ScreenTitleText>
            <ScreenTitleText style={styles.suffixText}>님 반갑습니다</ScreenTitleText>
          </View>
          <View style={styles.headerButtonContainer}>
            <Link href="/profile" asChild>
              <IconButton
                iconProps={{
                  font: { type: 'MaterialIcon', name: 'manage-accounts' },
                  color: theme.colors.typography,
                  size: theme.fontSize.xl,
                }}
              />
            </Link>
            <Link href="/settings" asChild>
              <IconButton
                iconProps={{
                  font: { type: 'MaterialIcon', name: 'menu' },
                  color: theme.colors.typography,
                  size: theme.fontSize.xl,
                }}
              />
            </Link>
          </View>
        </View>
      )}
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  welcomeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // gap: theme.spacing.sm,
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
