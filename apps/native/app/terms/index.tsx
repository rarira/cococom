import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { WebView } from 'react-native-webview';
import { useNavigation, router } from 'expo-router';
import { useLayoutEffect } from 'react';

import ModalScreenContainer from '@/components/custom/view/container/screen/modal';
import { HOMEPAGE_HOST } from '@/constants';
import CloseButton from '@/components/custom/button/close';

export default function TermsScreen() {
  const { styles } = useStyles(stylesheet);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={() => router.dismiss()} />,
    } as any);
  }, [navigation]);

  return (
    <ModalScreenContainer>
      <WebView
        style={styles.container}
        source={{ uri: `${HOMEPAGE_HOST}/statements?webview=true` }}
        showsVerticalScrollIndicator={true}
      />
    </ModalScreenContainer>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    overflowY: 'scroll',
  },
}));
