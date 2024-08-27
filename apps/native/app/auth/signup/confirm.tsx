import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SignUpConfirmForm from '@/components/custom/form/signup/&confirm';
import Text from '@/components/ui/text';

export default function AuthSignUpConfirmScreen() {
  const { styles } = useStyles(stylesheet);
  const { provider } = useLocalSearchParams<{ provider: string }>();
  const navigation = useNavigation();

  console.log('AuthSignUpConfirmScreen', provider);
  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>원활한 사용을 위해 아래 추가 정보를 확인하세요</Text>
      <SignUpConfirmForm />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
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
