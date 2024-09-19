import { Dispatch, memo, SetStateAction, useCallback } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TextInput from '@/components/core/text-input';

interface TextInputEyeSlotProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}

const TextInputEyeSlot = memo(function TextInputEyeSlot({
  show,
  setShow,
  disabled,
}: TextInputEyeSlotProps) {
  const { styles, theme } = useStyles(stylesheet);

  const handlePress = useCallback(() => setShow(prev => !prev), []);

  return (
    <TextInput.Slot style={styles.textInputSlot} onPress={handlePress} disabled={disabled}>
      <TextInput.Icon
        font={{ type: 'Ionicon', name: show ? 'eye' : 'eye-off' }}
        size={theme.fontSize.md}
      />
    </TextInput.Slot>
  );
});

const stylesheet = createStyleSheet(theme => ({
  textInputSlot: {
    paddingRight: theme.spacing.md,
  },
}));

export default TextInputEyeSlot;
