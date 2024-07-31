import {
  createContext,
  Dispatch,
  memo,
  PropsWithChildren,
  Reducer,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import { Pressable, PressableProps, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Icon, { IconProps } from '@/components/ui/icon';
import Text, { TextProps } from '@/components/ui/text';

interface CheckboxProps extends PressableProps {
  value: string;
  onChange?: ({ value, isChecked }: { value: string; isChecked: boolean }) => void;
  defaultIsChecked?: boolean;
  isChecked?: boolean;
}

interface CheckboxGroupViewProps extends ViewProps {
  value: string[];
  onChange?: (value: string[]) => void;
}

interface CheckboxIndicatorProps extends Omit<ViewProps, 'style'> {
  style?: (checked: boolean) => ViewProps['style'];
}

interface CheckboxIconProps extends Omit<IconProps, 'font'> {
  font?: IconProps['font'];
}

const CheckboxIconFont = { type: 'FontAwesomeIcon', name: 'check' };

type CheckboxContextType = {
  value: string;
  isChecked: boolean;
};

type CheckBoxDispatchContextType = (context: Partial<CheckboxContextType>) => void;

const CheckboxContext = createContext<CheckboxContextType | null>(null);

const CheckboxDispatchContext = createContext<CheckBoxDispatchContextType | null>(null);

function CheckboxProvider({ children }: PropsWithChildren) {
  const [state, setState] = useReducer<Reducer<CheckboxContextType, Partial<CheckboxContextType>>>(
    (state, newState) => ({ ...state, ...newState }),
    {
      value: '',
      isChecked: false,
    },
  );

  return (
    <CheckboxContext.Provider value={state}>
      <CheckboxDispatchContext.Provider value={setState}>
        {children}
      </CheckboxDispatchContext.Provider>
    </CheckboxContext.Provider>
  );
}

function useCheckbox() {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error('useCheckbox must be used within a CheckboxProvider');
  }
  return context;
}
function useCheckboxDispatch() {
  const context = useContext(CheckboxDispatchContext);
  if (!context) {
    throw new Error('useCheckboxDispatch must be used within a CheckboxProvider');
  }
  return context;
}

const CheckboxGroupContext = createContext<string[] | null>(null);

const CheckboxGroupDispatchContext = createContext<Dispatch<SetStateAction<string[]>> | null>(null);

function CheckboxGroupProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<string[]>([]);

  return (
    <CheckboxGroupContext.Provider value={state}>
      <CheckboxGroupDispatchContext.Provider value={setState}>
        {children}
      </CheckboxGroupDispatchContext.Provider>
    </CheckboxGroupContext.Provider>
  );
}

function useCheckboxGroup() {
  return useContext(CheckboxGroupContext);
}

function useCheckboxGroupDispatch() {
  return useContext(CheckboxGroupDispatchContext);
}

const CheckboxGroupView = memo(function CheckboxGroup({
  value,
  onChange,
  ...restProps
}: CheckboxGroupViewProps) {
  const checkboxGroupContext = useCheckboxGroup();
  const setCheckboxGroupContext = useCheckboxGroupDispatch();
  const firstInitRef = useRef(false);

  useEffect(() => {
    if (!firstInitRef.current) {
      setCheckboxGroupContext?.(value);
      firstInitRef.current = true;
    }
  }, [setCheckboxGroupContext, value]);

  useEffect(() => {
    if (checkboxGroupContext) {
      onChange?.(checkboxGroupContext);
    }
  }, [onChange, checkboxGroupContext]);

  return <View {...restProps} />;
});

const CheckboxPressable = memo(function CheckboxPressable({
  style,
  value,
  isChecked,
  defaultIsChecked,
  onChange,
  ...restProps
}: CheckboxProps) {
  const checkboxContext = useCheckbox();
  const setCheckboxContext = useCheckboxDispatch();
  const setCheckboxGroupContext = useCheckboxGroupDispatch();

  const firstInitRef = useRef(false);

  const { styles } = useStyles(stylesheet);

  useEffect(() => {
    if (!firstInitRef.current) {
      setCheckboxContext({ isChecked: defaultIsChecked || isChecked, value });
      firstInitRef.current = true;
    }
  }, [defaultIsChecked, isChecked, setCheckboxContext, value]);

  useEffect(() => {
    onChange?.({ isChecked: checkboxContext.isChecked, value: checkboxContext.value });
    if (setCheckboxGroupContext) {
      if (checkboxContext.isChecked) {
        setCheckboxGroupContext(values => (values.includes(value) ? values : [...values, value]));
      } else {
        setCheckboxGroupContext(values => values.filter(v => v !== value));
      }
    }
  }, [checkboxContext.isChecked, checkboxContext.value, onChange, setCheckboxGroupContext, value]);

  const handlePress = useCallback(
    () => setCheckboxContext({ isChecked: !checkboxContext.isChecked }),
    [checkboxContext.isChecked, setCheckboxContext],
  );

  return (
    <Pressable
      style={state => [styles.pressable, typeof style === 'function' ? style(state) : style]}
      onPress={handlePress}
      {...restProps}
    />
  );
});

const CheckboxWrapper = memo(function CheckboxWrapper(props: CheckboxProps) {
  return (
    <CheckboxProvider>
      <CheckboxPressable {...props} />
    </CheckboxProvider>
  );
});

const CheckboxGroupWrapper = memo(function CheckboxGroupWrapper(props: CheckboxGroupViewProps) {
  return (
    <CheckboxGroupProvider>
      <CheckboxGroupView {...props} />
    </CheckboxGroupProvider>
  );
});

const CheckboxIndicator = memo(function CheckboxIndicator({
  style,
  children,
  ...restProps
}: CheckboxIndicatorProps) {
  const { isChecked } = useCheckbox();

  const { styles } = useStyles(stylesheet);

  return (
    <View style={[styles.indicator(isChecked), style?.(isChecked)]} {...restProps}>
      {isChecked ? children : null}
    </View>
  );
});

const CheckboxIcon = memo(function CheckboxIcon({ style, font, ...restProps }: CheckboxIconProps) {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Icon
      style={[styles.icon, style]}
      size={theme.fontSize.sm}
      color={theme.colors.background}
      font={font || (CheckboxIconFont as IconProps['font'])}
      {...restProps}
    />
  );
});

const CheckboxLabel = memo(function CheckboxLabel({ style, ...restProps }: TextProps) {
  const { styles } = useStyles(stylesheet);

  return <Text style={[styles.label, style]} {...restProps} />;
});

const stylesheet = createStyleSheet(theme => ({
  pressable: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  indicator: (checked: boolean) => ({
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.fontSize.md,
    height: theme.fontSize.md,
    borderRadius: theme.fontSize.md / 4,
    backgroundColor: checked ? theme.colors.tint : 'transparent',
    borderColor: checked ? theme.colors.tint : theme.colors.typography,
    borderWidth: 1,
  }),
  icon: {
    fontWeight: 'bold',
  },
  label: {
    color: theme.colors.typography,
    fontSize: theme.fontSize.sm,
  },
}));

const Checkbox = {
  Group: CheckboxGroupWrapper,
  Root: CheckboxWrapper,
  Indicator: CheckboxIndicator,
  Icon: CheckboxIcon,
  Label: CheckboxLabel,
};

export default Checkbox;
