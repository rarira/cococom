import { memo } from 'react';
import { View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';

interface TextInputCounterViewProps {
  currentLength: number;
  maxLength: number;
  style?: ViewProps['style'];
}

const TextInputCounterView = memo(function TextInputCounterView({
  currentLength,
  maxLength,
  style,
}: TextInputCounterViewProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={style}>
      <Text style={styles.counterText(currentLength >= maxLength)}>{currentLength}</Text>
      <Text style={styles.basicText}>{` / `}</Text>
      <Text style={styles.basicText}>{maxLength}</Text>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  basicText: {
    color: `${theme.colors.typography}99`,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
  },
  counterText: (isOver: boolean) => ({
    color: isOver ? theme.colors.alert : `${theme.colors.typography}99`,
    fontWeight: isOver ? 'bold' : 'normal',
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
  }),
}));

export default TextInputCounterView;
