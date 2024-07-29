import Text from '@/components/ui/text';
import { createContext, memo, ReactNode, Reducer, useContext, useEffect, useReducer } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface CheckboxProps extends PressableProps {
  value: string;
  onChange?: (value: boolean) => void;
  defaultIsChecked?: boolean;
  isChecked?: boolean;
}

type CheckboxContextType = {
  value: string;
  isChecked: boolean;
};

type CheckBoxDispatchContextType = (context: Partial<CheckboxContextType>) => void;

const CheckboxContext = createContext<CheckboxContextType | null>(null);

const CheckboxDispatchContext = createContext<CheckBoxDispatchContextType | null>(null);

function CheckboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useReducer<Reducer<CheckboxContextType, Partial<CheckboxContextType>>>(
    (state, action) => ({ ...state, action }),
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
  const setContext = useContext(CheckboxDispatchContext);
  if (!context || !setContext) {
    throw new Error('useCheckbox must be used within a CheckboxProvider');
  }
  return [context, setContext] as const;
}

const CheckboxPressable = memo(function CheckboxPressable({
  style,
  isChecked,
  defaultIsChecked,
  ...restProps
}: CheckboxProps) {
  const [checboxContext, setCheckboxContext] = useCheckbox();
  const { styles } = useStyles(stylesheet);

  useEffect(() => {
    if (isChecked !== undefined) {
      setCheckboxContext({ isChecked });
    } else if (defaultIsChecked !== undefined) {
      setCheckboxContext({ isChecked: defaultIsChecked });
    }
  }, [ defaultIsChecked, isChecked, setCheckboxContext]);

  return (
    <Pressable
      style={state => [styles.wrapper, typeof style === 'function' ? style(state) : style]}
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

const CheckboxTest = memo(function CheckboxTest() {
  const [context, setContext] = useCheckbox();
  console.log('context', context);

  return (
    <View>
      <Text>Checkbox</Text>
    </View>
  );
});


const stylesheet = createStyleSheet(theme => ({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
}));

const Checkbox = {
  Root: CheckboxWrapper,
  Test: CheckboxTest,
};

export default Checkbox;
