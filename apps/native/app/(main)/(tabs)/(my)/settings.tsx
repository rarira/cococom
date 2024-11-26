import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

import IconButton from '@/components/core/button/icon';
import RowMenu from '@/components/core/menu/row';
import DiscountChannelArrangeBottomSheet from '@/components/custom/bottom-sheet/discount-channel-arrange';
import SectionText from '@/components/custom/text/section';
import ScreenContainerView from '@/components/custom/view/container/screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDiscountChannels } from '@/store/discount-channels';
import { useUserStore } from '@/store/user';
import Text from '@/components/core/text';
import OptOutNotificationDialog from '@/components/custom/dialog/opt-out-notification';
import { PortalHostNames } from '@/constants';

export default function ProfileScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const user = useUserStore(state => state.user);
  const discountChannels = useDiscountChannels(state => state.discountChannels);

  const stringifiedDiscountChannels = useMemo(() => {
    return discountChannels.map(channel => channel.text).join('/');
  }, [discountChannels]);

  const { theme: colorTheme, handleToggleAutoTheme, handleToggleTheme } = useColorScheme();

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
          <RowMenu.ToggleSwitch checked={colorTheme === null} onToggle={handleToggleAutoTheme} />
        </RowMenu.Root>
        {colorTheme !== null && (
          <RowMenu.Root style={styles.withPaddingHorizontal}>
            <RowMenu.Text>다크 모드</RowMenu.Text>
            <RowMenu.ToggleSwitch checked={colorTheme === 'dark'} onToggle={handleToggleTheme} />
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
          <IconButton
            onPress={handlePressDiscountChannelArrange}
            iconProps={{
              font: { type: 'Ionicon', name: 'chevron-down' },
              size: theme.fontSize.xl,
              color: theme.colors.typography,
            }}
            textStyle={styles.channelText}
            text={stringifiedDiscountChannels}
          />
        </RowMenu.Root>
        <SectionText style={styles.withPaddingHorizontal} isFirstSection>
          버전 정보
        </SectionText>
        <RowMenu.Root style={[styles.withPaddingHorizontal, styles.rowWithNoInteraction]}>
          <RowMenu.Text>앱 버전</RowMenu.Text>
          <Text style={styles.channelText}>{Constants.expoConfig?.version ?? ''}</Text>
        </RowMenu.Root>
        <RowMenu.Root style={[styles.withPaddingHorizontal, styles.rowWithNoInteraction]}>
          <RowMenu.Text>런타임 버전</RowMenu.Text>
          <Text style={styles.channelText}>{Updates.runtimeVersion}</Text>
        </RowMenu.Root>
      </ScreenContainerView>
      <OptOutNotificationDialog
        portalHostName={PortalHostNames.SETTINGS}
        visible={visible}
        setVisible={setVisible}
      />
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
  rowWithNoInteraction: {
    backgroundColor: `${theme.colors.modalBackground}22`,
  },
  channelText: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
}));
