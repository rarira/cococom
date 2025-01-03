import { memo, ReactElement, ReactNode } from 'react';
import { ViewProps } from 'react-native';
import { create } from 'react-test-renderer';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import Checkbox from '@/components/core/checkbox';

interface TermsAgreeCheckboxProps {
  option: string;
  value: {
    label: ReactElement;
    iconColor: string;
  };
  isChecked: boolean;
  onChange: ({ value, isChecked }: { value: string; isChecked: boolean }) => void;
}

const TermsAgreeCheckbox = memo(function TermsAgreeCheckbox({
  option,
  value,
  isChecked,
  onChange,
}: TermsAgreeCheckboxProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Checkbox
      key={option}
      value={option}
      defaultIsChecked={false}
      isChecked={isChecked}
      onChange={onChange}
    >
      <Checkbox.Indicator style={styles.checkboxIndicator}>
        <Checkbox.Icon color={value.iconColor} />
      </Checkbox.Indicator>
      {value.label}
    </Checkbox>
  );
});

const stylesheet = createStyleSheet(theme => ({
  checkboxIndicator: (checked: boolean) => ({
    backgroundColor: checked ? theme.colors.tint : 'transparent',
    borderColor: checked ? theme.colors.tint : theme.colors.typography,
  }),
}));

export default TermsAgreeCheckbox;
