import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text, { TextProps } from '@/components/core/text';

interface ChipProps {
  text: string;
  style?: StyleProp<ViewStyle>;
  textProps?: TextProps;
  renderSuffix?: () => JSX.Element;
}

function Chip({ text, style, textProps, renderSuffix }: ChipProps) {
  const { styles } = useStyles(stylesheet);

  const { style: textStyle, ...restTextProps } = textProps || {};

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]} {...restTextProps}>
        {text}
      </Text>
      {renderSuffix && renderSuffix()}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.tint,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  text: {
    color: theme.colors.background,
    fontSize: theme.fontSize.xxs,
    lineHeight: theme.fontSize.xs,
    fontWeight: 'bold',
  },
}));

export default Chip;
