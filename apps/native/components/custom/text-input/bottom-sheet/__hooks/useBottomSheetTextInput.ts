import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { useCallback, useEffect } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

export function useBottomSheetTextInput({
  onFocus,
  onBlur,
}:
  | {
      onFocus?: (args: NativeSyntheticEvent<TextInputFocusEventData>) => void;
      onBlur?: (args: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    }
  | undefined = {}) {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  const handleOnFocus = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = true;
      if (onFocus) {
        onFocus(args);
      }
    },
    [onFocus, shouldHandleKeyboardEvents],
  );

  const handleOnBlur = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = false;
      if (onBlur) {
        onBlur(args);
      }
    },
    [onBlur, shouldHandleKeyboardEvents],
  );

  useEffect(() => {
    return () => {
      // Reset the flag on unmount
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]);

  return {
    handleOnFocus,
    handleOnBlur,
  };
}
