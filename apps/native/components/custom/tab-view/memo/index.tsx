import { memo } from 'react';
import { View } from 'react-native';
import { useCollapsibleStyle } from 'react-native-collapsible-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import LoginButton from '@/components/custom/button/login';
import ItemMemoList from '@/components/custom/list/item-memo';
import Text from '@/components/ui/text';
import { useUserStore } from '@/store/user';

interface MemoTabViewProps {
  itemId: number;
}

const MemoTabView = memo(function MemoTabView({ itemId, memoBottomSheetRef }: MemoTabViewProps) {
  const { styles } = useStyles(stylesheet);

  const user = useUserStore(store => store.user);

  const collapsibleStyle = useCollapsibleStyle();

  const height = !!user
    ? undefined
    : collapsibleStyle.contentContainerStyle?.minHeight - collapsibleStyle.progressViewOffset;

  console.log('MemoTabView render', height);
  return (
    <View style={styles.container(height)}>
      {!user ? (
        <View style={styles.loginContainer}>
          <LoginButton style={styles.loginButton} />
          <Text style={styles.loginText}>
            로그인하시면 본 상품에 대한 메모를 남기실 수 있습니다
          </Text>
        </View>
      ) : (
        <ItemMemoList user={user} />
      )}
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: (height?: number) => ({
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.screenHorizontalPadding,
  }),
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
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