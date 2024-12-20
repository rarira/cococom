import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import Util from '@/libs/util';

interface DiscountRateTextProps {
  discountRate: number;
  fontSize?: number;
}

function DiscountRateText({ discountRate, fontSize }: DiscountRateTextProps) {
  const { styles } = useStyles(stylesheet);

  return <Text style={styles.text(fontSize)}>{`-${Util.toPercentString(discountRate)}%`}</Text>;
}

const stylesheet = createStyleSheet(theme => ({
  text: (fontSize?: number) => ({
    fontSize: fontSize || theme.fontSize.md - 1,
    lineHeight: fontSize || theme.fontSize.md - 1,
    color: theme.colors.alert,
    marginEnd: theme.spacing.sm,
  }),
}));

export default DiscountRateText;
