import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import Util from '@/libs/util';

interface SuperscriptWonTextProps {
  price: number;
  superscript?: string;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  isMinus?: boolean;
}

function SuperscriptWonText({
  price,
  superscript = '\u20A9',
  fontSize,
  style,
  isMinus,
}: SuperscriptWonTextProps) {
  const { styles } = useStyles(stylesheets);
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.superscriptText(fontSize, isMinus)}>{superscript}</Text>
      <Text style={styles.normalText(fontSize, isMinus)}>{Util.toWonString(price)}</Text>
      {isMinus && <Text style={styles.normalText(fontSize, isMinus)}> 할인</Text>}
    </View>
  );
}

const stylesheets = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  normalText: (fontSize?: number, isMinus?: boolean) => ({
    fontSize: fontSize || theme.fontSize.md,
    lineHeight: fontSize || theme.fontSize.md,
    fontWeight: 'bold',
    color: isMinus ? theme.colors.alert : theme.colors.typography,
  }),
  superscriptText: (fontSize?: number, isMinus?: boolean) => ({
    fontSize: fontSize || theme.fontSize.sm,
    lineHeight: (fontSize || theme.fontSize.sm) * 1.3,
    color: isMinus ? theme.colors.alert : theme.colors.typography,
  }),
}));

export default SuperscriptWonText;
