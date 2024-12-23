import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { PortalHost } from '@gorhom/portal';

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
import { PORTAL_HOST_NAMES } from '@/constants';
import { useUpdateNotificationSetting } from '@/hooks/notification/useUpdateNotificationSetting';
import Util from '@/libs/util';
import Button from '@/components/core/button';
import { useWalkthroughStore } from '@/store/walkthrough';

export default function SettingsScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const user = useUserStore(state => state.user);
  const discountChannels = useDiscountChannels(state => state.discountChannels);
  const init = useWalkthroughStore(state => state.init);

  const stringifiedDiscountChannels = useMemo(() => {
    return discountChannels.map(channel => channel.text).join('/');
  }, [discountChannels]);

  const { theme: colorTheme, handleToggleAutoTheme, handleToggleTheme } = useColorScheme();

  const {
    granted,
    optOutDialogVisible,
    setOptOutDialogVisible,
    dialogProps,
    handleToggleNotification,
  } = useUpdateNotificationSetting();

  const handlePressDiscountChannelArrange = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <>
      <ScreenContainerView withHeader style={styles.container}>
        <SectionText style={styles.withPaddingHorizontal} isFirstSection>
          화면 테마
        </SectionText>
        <RowMenu style={styles.withPaddingHorizontal}>
          <RowMenu.Text>자동 (시스템 설정)</RowMenu.Text>
          <RowMenu.ToggleSwitch checked={colorTheme === 'auto'} onToggle={handleToggleAutoTheme} />
        </RowMenu>
        {colorTheme !== 'auto' && (
          <RowMenu style={styles.withPaddingHorizontal}>
            <RowMenu.Text>다크 모드</RowMenu.Text>
            <RowMenu.ToggleSwitch checked={colorTheme === 'dark'} onToggle={handleToggleTheme} />
          </RowMenu>
        )}
        {!!user && Util.isDevice() && (
          <>
            <SectionText style={styles.withPaddingHorizontal}>푸시 알림 설정</SectionText>
            <RowMenu style={styles.withPaddingHorizontal}>
              <RowMenu.Text>할인 정보 업데이트 알림 수신</RowMenu.Text>
              <RowMenu.ToggleSwitch checked={granted} onToggle={handleToggleNotification} />
            </RowMenu>
          </>
        )}
        <SectionText style={styles.withPaddingHorizontal} isFirstSection>
          기타 설정
        </SectionText>
        <RowMenu style={styles.withPaddingHorizontal}>
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
        </RowMenu>
        <SectionText style={styles.withPaddingHorizontal} isFirstSection>
          버전 정보
        </SectionText>
        <RowMenu style={[styles.withPaddingHorizontal, styles.rowWithNoInteraction]}>
          <RowMenu.Text>앱 버전</RowMenu.Text>
          <Text style={styles.channelText}>{Constants.expoConfig?.version ?? ''}</Text>
        </RowMenu>
        <RowMenu style={[styles.withPaddingHorizontal, styles.rowWithNoInteraction]}>
          <RowMenu.Text>런타임 버전</RowMenu.Text>
          <Text style={styles.channelText}>{Updates.runtimeVersion}</Text>
        </RowMenu>
        <Button onPress={init} style={styles.withPaddingHorizontal}>
          <Text>init초기화</Text>
        </Button>
        <PortalHost name={PORTAL_HOST_NAMES.SETTINGS} />
        <OptOutNotificationDialog
          portalHostName={PORTAL_HOST_NAMES.SETTINGS}
          visible={optOutDialogVisible}
          setVisible={setOptOutDialogVisible}
          {...dialogProps!}
        />
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
  rowWithNoInteraction: {
    backgroundColor: `${theme.colors.modalBackground}22`,
  },
  channelText: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
}));
