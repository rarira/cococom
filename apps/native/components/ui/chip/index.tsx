import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text, { TextProps } from '@/components/ui/text';

interface ChipProps {
  text: string;
  style?: StyleProp<ViewStyle>;
  textProps?: TextProps;
}

function Chip({ text, style, textProps }: ChipProps) {
  const { styles } = useStyles(stylesheet);

  const { style: textStyle, ...restTextProps } = textProps || {};

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]} {...restTextProps}>
        {text}
      </Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    backgroundColor: theme.colors.tint,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  text: {
    color: 'white',
    fontSize: theme.fontSize.xs,
    lineHeight: theme.fontSize.xs,
    fontWeight: 'bold',
  },
}));

export default Chip;