import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import Util from '@/libs/util';

interface SuperscriptWonTextProps {
  price: number;
  superscript?: string;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
}

function SuperscriptWonText({
  price,
  superscript = '\u20A9',
  fontSize,
  style,
}: SuperscriptWonTextProps) {
  const { styles } = useStyles(stylesheets);
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.superscriptText(fontSize)}>{superscript}</Text>
      <Text style={styles.normalText(fontSize)}>{Util.toWonString(price)}</Text>
    </View>
  );
}

const stylesheets = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  normalText: (fontSize?: number) => ({
    fontSize: fontSize || theme.fontSize.md,
    lineHeight: fontSize || theme.fontSize.md,
    fontWeight: 'bold',
  }),
  superscriptText: (fontSize?: number) => ({
    fontSize: ((fontSize || theme.fontSize.md) * 2) / 3,
    lineHeight: ((fontSize || theme.fontSize.md) * 2) / 3,
  }),
}));

export default SuperscriptWonText;
