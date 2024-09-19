import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Button, { ButtonProps } from '@/components/core/button';
import Text from '@/components/core/text';

interface FormSubmitButtonProps extends ButtonProps {
  text: string;
}

const FormSubmitButton = memo(function FormSubmitButton({
  style,
  text,
  ...restProps
}: FormSubmitButtonProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Button style={[styles.submitButton, style]} {...restProps}>
      <Text style={styles.submitButtonText}>{text}</Text>
    </Button>
  );
});

const stylesheet = createStyleSheet(theme => ({
  submitButton: {
    backgroundColor: theme.colors.tint,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    paddingVertical: theme.spacing.md,
  },
}));

export default FormSubmitButton;
