import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import Util from '@/libs/util';

interface SuperscriptWonTextProps {
  price: number;
  superscript?: string;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  isMinus?: boolean;
  bold?: boolean;
}

function SuperscriptWonText({
  price,
  superscript = '\u20A9',
  fontSize,
  style,
  isMinus,
  bold = true,
}: SuperscriptWonTextProps) {
  const { styles } = useStyles(stylesheets);
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.superscriptText(fontSize, isMinus)}>{superscript}</Text>
      <Text style={styles.normalText(fontSize, isMinus, bold)}>{Util.toWonString(price)}</Text>
      {isMinus && <Text style={styles.normalText(fontSize, isMinus)}> 할인</Text>}
    </View>
  );
}

const stylesheets = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  normalText: (fontSize?: number, isMinus?: boolean, bold?: boolean) => ({
    fontSize: fontSize || theme.fontSize.md,
    lineHeight: fontSize || theme.fontSize.md,
    fontWeight: bold ? 'bold' : 'normal',
    color: isMinus ? theme.colors.alert : theme.colors.typography,
  }),
  superscriptText: (fontSize?: number, isMinus?: boolean) => ({
    fontSize: ((fontSize ?? 0) * 3) / 4 || theme.fontSize.sm,
    lineHeight: (((fontSize ?? 0) * 3) / 4 || theme.fontSize.sm) * 1.3,
    color: isMinus ? theme.colors.alert : theme.colors.typography,
  }),
}));

export default SuperscriptWonText;
