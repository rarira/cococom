import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef } from 'react';
import { Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import RowMenu from '@/components/core/menu/row';
import Text from '@/components/core/text';
import DiscountChannelArrangeBottomSheet from '@/components/custom/bottom-sheet/discount-channel-arrange';
import SectionText from '@/components/custom/text/section';
import ScreenContainerView from '@/components/custom/view/container/screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDiscountChannels } from '@/store/discount-channels';
import { useUserStore } from '@/store/user';

export default function ProfileScreen() {
  const { styles } = useStyles(stylesheet);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const user = useUserStore(state => state.user);
  const discountChannels = useDiscountChannels(state => state.discountChannels);

  const stringifiedDiscountChannels = useMemo(() => {
    return discountChannels.map(channel => channel.text).join('/');
  }, [discountChannels]);

  const { theme, handleToggleAutoTheme, handleToggleTheme } = useColorScheme();

  // useLayoutEffect(() => {
  //   if (!user) router.navigate('/(my)');
  // }, [user]);

  const handlePressDiscountChannelArrange = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
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
        {!!user && (
          <>
            <SectionText style={styles.withPaddingHorizontal}>푸시 알림 설정</SectionText>
            <RowMenu.Root style={styles.withPaddingHorizontal}>
              <RowMenu.Text>할인 정보 업데이트 알림 수신</RowMenu.Text>
              <RowMenu.ToggleSwitch
                checked={false}
                onToggle={() => console.log('노티 관련 구현 필요')}
              />
            </RowMenu.Root>
          </>
        )}
        <SectionText style={styles.withPaddingHorizontal} isFirstSection>
          기타 설정
        </SectionText>
        <RowMenu.Root style={styles.withPaddingHorizontal}>
          <RowMenu.Text>검색 채널 표시 순서</RowMenu.Text>
          <Pressable onPress={handlePressDiscountChannelArrange}>
            <Text>{stringifiedDiscountChannels}</Text>
          </Pressable>
        </RowMenu.Root>
      </ScreenContainerView>
      <DiscountChannelArrangeBottomSheet ref={bottomSheetModalRef} />
    </>
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
