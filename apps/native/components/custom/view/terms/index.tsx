import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link } from 'expo-router';

import TermsAgreeCheckbox from '@/components/custom/checkbox/terms-agree';
import { useSocialSignIn } from '@/hooks/auth/useSocialSignIn';
import Text from '@/components/core/text';

interface TermsViewProps
  extends Pick<ReturnType<typeof useSocialSignIn>, 'termsAgreed' | 'handleTermsAgreedChange'> {}

const TermsView = memo(function TermsView({
  termsAgreed,
  handleTermsAgreedChange,
}: TermsViewProps) {
  const { styles, theme } = useStyles(stylesheet);

  const Label = useMemo(() => {
    return (
      <View style={styles.labelContainer}>
        <Link href="/terms">
          <Text style={[styles.labelText, styles.labelLinkText]}>이용약관 및 개인정보처리방침</Text>
        </Link>
        <Text style={styles.labelText}>에 동의합니다</Text>
      </View>
    );
  }, [styles.labelContainer, styles.labelLinkText, styles.labelText]);

  return (
    <View style={styles.container}>
      <TermsAgreeCheckbox
        option="terms-agree"
        value={{
          label: Label,
          iconColor: theme.colors.background,
        }}
        isChecked={termsAgreed}
        onChange={handleTermsAgreedChange}
      />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  labelText: {
    fontSize: theme.fontSize.sm,
  },
  labelLinkText: {
    color: theme.colors.link,
    fontSize: theme.fontSize.sm,
    fontWeight: 'semibold',
    textDecorationLine: 'underline',
  },
}));

export default TermsView;
