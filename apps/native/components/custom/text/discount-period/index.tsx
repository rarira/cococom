import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import { convertDateString } from '@/libs/date';

interface DiscountPeriodTextProps {
  endDate: string;
  style?: StyleProp<ViewStyle>;
}

function DiscountPeriodText({ endDate, style }: DiscountPeriodTextProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{`~ ${convertDateString(endDate)}`}</Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {},
  text: {
    fontSize: theme.fontSize.xs,
    opacity: 0.6,
  },
}));

export default DiscountPeriodText;
