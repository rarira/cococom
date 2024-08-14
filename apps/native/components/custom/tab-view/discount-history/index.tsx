import { JoinedItems } from '@cococom/supabase/types';
import { memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';

interface DiscountHistoryTabViewProps {
  discounts: JoinedItems['discounts'];
}

const DiscountHistoryTabView = memo(function DiscountHistoryTabView({
  discounts,
}: DiscountHistoryTabViewProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text>{discounts?.join(',')}</Text>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.screenHorizontalPadding,
  },
}));

export default DiscountHistoryTabView;
