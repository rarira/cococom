import { router } from 'expo-router';
import { useLayoutEffect } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SectionText from '@/components/custom/text/section';
import ScreenContainerView from '@/components/custom/view/container/screen';
import RowMenu from '@/components/ui/menu/row';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserStore } from '@/store/user';

export default function ProfileScreen() {
  const { styles } = useStyles(stylesheet);
  const user = useUserStore(state => state.user);

  const { theme, handleToggleAutoTheme, handleToggleTheme } = useColorScheme();

  useLayoutEffect(() => {
    if (!user) router.navigate('/(my)');
  }, [user]);

  return (
    <ScreenContainerView withHeader style={styles.container}>
      <SectionText style={styles.withPaddingHorizontal} isFirstSection>
        화면 테마
      </SectionText>
      <RowMenu.Root style={styles.withPaddingHorizontal}>
        <RowMenu.Text>자동 (시스템 설정)</RowMenu.Text>
        <RowMenu.ToggleSwitch checked={theme === null} onToggle={handleToggleAutoTheme} />
      </RowMenu.Root>
      {theme !== null && (
        <RowMenu.Root style={styles.withPaddingHorizontal}>
          <RowMenu.Text>다크 모드</RowMenu.Text>
          <RowMenu.ToggleSwitch checked={theme === 'dark'} onToggle={handleToggleTheme} />
        </RowMenu.Root>
      )}
      <SectionText style={styles.withPaddingHorizontal}>푸시 알림 설정</SectionText>
      <RowMenu.Root style={styles.withPaddingHorizontal}>
        <RowMenu.Text>할인 정보 업데이트 알림 수신</RowMenu.Text>
        <RowMenu.ToggleSwitch checked={theme === null} onToggle={handleToggleAutoTheme} />
      </RowMenu.Root>
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: 0,
  },
  withPaddingHorizontal: {
    paddingHorizontal: theme.screenHorizontalPadding,
  },
}));
