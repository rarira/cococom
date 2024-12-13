import { memo } from 'react';
import { ViewProps } from 'react-native';

import Checkbox from '@/components/core/checkbox';

interface SearchOptionCheckboxProps {
  option: string;
  value: {
    label: string;
    iconColor: string;
  };
  indicatorStyle?: (checked: boolean) => ViewProps['style'];
}

const SearchOptionCheckbox = memo(function SearchOptionCheckbox({
  indicatorStyle,
  option,
  value,
}: SearchOptionCheckboxProps) {
  return (
    <Checkbox key={option} value={option}>
      <Checkbox.Indicator style={indicatorStyle}>
        <Checkbox.Icon color={value.iconColor} />
      </Checkbox.Indicator>
      <Checkbox.Label>{value.label}</Checkbox.Label>
    </Checkbox>
  );
});

export default SearchOptionCheckbox;
