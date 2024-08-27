import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SignUpConfirmForm from '@/components/custom/form/signup/&confirm';
import Text from '@/components/ui/text';

export default function AuthSignUpConfirmScreen() {
  const { styles } = useStyles(stylesheet);
  const { provider } = useLocalSearchParams<{ provider: string }>();
  const { bottom } = useSafeAreaInsets();

  console.log('AuthSignUpConfirmScreen', provider);

  return (
    <View style={styles.container(bottom)}>
      <Text style={styles.title}>원활한 사용을 위해 아래 추가 정보를 확인하세요</Text>
      <SignUpConfirmForm />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (bottom: number) => ({
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: bottom + theme.spacing.xl,
  }),
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  resendButton: {
    marginTop: theme.spacing.lg,
  },
}));
