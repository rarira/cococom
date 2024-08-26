import { memo } from 'react';
import { View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import LoginButton from '@/components/custom/button/login';
import ItemMemoView from '@/components/custom/view/item-memo';
import Text from '@/components/ui/text';
import { useUserStore } from '@/store/user';

export interface MemoTabViewProps {
  itemId: number;
}

const MemoTabView = memo(function MemoTabView({ itemId }: MemoTabViewProps) {
  const { styles } = useStyles(stylesheet);

  const user = useUserStore(store => store.user);

  return (
    <>
      {!user ? (
        <Tabs.ScrollView>
          <View style={styles.container(!!user)}>
            <LoginButton style={styles.loginButton} />
            <Text style={styles.loginText}>
              로그인하시면 본 상품에 대한 메모를 남기실 수 있습니다
            </Text>
          </View>
        </Tabs.ScrollView>
      ) : (
        <ItemMemoView itemId={itemId} />
      )}
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: (authed?: boolean) => ({
    height: !authed ? 200 : undefined,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    gap: theme.spacing.lg,
  }),
  loginButton: {
    width: undefined,
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  loginText: {
    color: theme.colors.typography,
    fontSize: theme.fontSize.sm,
  },
}));

export default MemoTabView;
