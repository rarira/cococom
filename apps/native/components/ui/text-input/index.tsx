import { createContext, memo, useContext } from 'react';
import {
  Pressable,
  PressableProps,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewProps,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TextInputCounterView from '@/components/custom/view/text-input-counter';
import Icon, { IconProps } from '@/components/ui/icon';
import Text, { TextProps } from '@/components/ui/text';
import Util from '@/libs/util';

type TextInputContextType = {
  variants?: 'outlined' | 'underlined' | 'rounded';
  editable?: boolean;
  value?: string;
  maxLength?: number;
  defaultValue?: string;
  error?: string;
  renderButton?: () => JSX.Element;
};
interface TextInputWrapperProps extends ViewProps, TextInputContextType {}

const TextInputContext = createContext<TextInputContextType>({});

function useTextInputContext() {
  const context = useContext(TextInputContext);
  if (!context) {
    throw new Error(
      'TextInput compound components cannot be rendered outside the TextInpu.Root component',
    );
  }

  return context;
}

const TextInputWrapper = memo(function TextInputWrapper({
  style,
  variants = 'outlined',
  children,
  editable = true,
  error,
  maxLength,
  value,
  defaultValue,
  renderButton,
  ...restProps
}: TextInputWrapperProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <TextInputContext.Provider value={{ editable, value, maxLength, error, renderButton }}>
      <View style={[styles.container, style]} {...restProps}>
        <View
          style={[
            styles.rowContainer(!!editable, !!error),
            [variants ? styles[variants] : {}],
            style,
          ]}
          {...restProps}
        >
          {children}
        </View>
        <TextInputAccessoryRow>
          <TextInputError />
          <TextInputCounter />
        </TextInputAccessoryRow>
      </View>
    </TextInputContext.Provider>
  );
});

const TextInputAccessoryRow = memo(function TextInputAccessoryRow({
  style,
  ...restProps
}: ViewProps) {
  const { styles } = useStyles(stylesheet);

  return <View style={[styles.accessoryContainer, style]} {...restProps} />;
});

const TextInputField = memo(function TextInputField({
  style,
  ...restProps
}: Omit<RNTextInputProps, 'editable' | 'value' | 'defaultValue' | 'maxLength'>) {
  const { styles } = useStyles(stylesheet);
  const { editable, value, maxLength, defaultValue, error } = useTextInputContext();

  return (
    <RNTextInput
      style={[styles.field(!!editable, !!error), style]}
      editable={editable}
      value={value}
      defaultValue={defaultValue}
      maxLength={maxLength}
      {...restProps}
    />
  );
});

const TextInputSlot = memo(function TextInputSlot({ style, ...restProps }: PressableProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      style={state => [styles.slot, typeof style === 'function' ? style(state) : style]}
      {...restProps}
    />
  );
});

const TextInputIcon = memo(function TextInputIcon({ style, ...restProps }: IconProps) {
  const { theme } = useStyles();
  return (
    <Icon style={style} size={theme.fontSize.lg} color={theme.colors.typography} {...restProps} />
  );
});

type TextInputCounterProps = ViewProps & { renderButton?: () => JSX.Element };

const TextInputCounter = memo(function TextInputCounter({
  style,
  ...restProps
}: TextInputCounterProps) {
  const { styles } = useStyles(stylesheet);
  const { value, defaultValue, maxLength, renderButton } = useTextInputContext();

  if (!maxLength) return null;

  return (
    <View style={styles.counterContainer}>
      {maxLength && (
        <TextInputCounterView
          currentLength={value?.length || defaultValue?.length || 0}
          maxLength={maxLength}
          style={style}
          {...restProps}
        />
      )}
      {renderButton && renderButton()}
    </View>
  );
});

const TextInputError = memo(function TextInputError({
  style,
  ...restProps
}: Omit<TextProps, 'children'>) {
  const { styles } = useStyles(stylesheet);
  const { error } = useTextInputContext();
  console.log('text input error', error);

  if (!error) return <View style={{ width: 100 }} />;

  return (
    <Text style={[styles.error, style]} {...restProps}>
      {error}
    </Text>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  rowContainer: (editable: boolean, error: boolean) => ({
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    width: '100%',
    paddingVertical: theme.spacing.md,
    borderColor: Util.hexToRgba(
      error ? theme.colors.alert : theme.colors.typography,
      editable ? 0.6 : 0.2,
    ),
  }),
  accessoryContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  outlined: {
    borderWidth: 1,
  },
  underlined: {
    borderBottomWidth: 1,
  },
  rounded: {
    borderRadius: 100,
    borderWidth: 1,
  },
  field: (editable: boolean, error: boolean) => ({
    flex: 1,
    color: error ? theme.colors.alert : theme.colors.typography,
    fontSize: theme.fontSize.md,
    opacity: editable ? 1 : 0.5,
  }),
  slot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  error: {
    color: theme.colors.alert,
    fontSize: theme.fontSize.sm,
  },
}));

const TextInput = {
  Root: TextInputWrapper,
  Field: TextInputField,
  Slot: TextInputSlot,
  Icon: TextInputIcon,
};

export default TextInput;
