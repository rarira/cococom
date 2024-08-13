import { JoinedItems } from '@cococom/supabase/types';
import { memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import { isItemOnSaleNow } from '@/libs/date';

interface ItemDetailsHeaderInfoViewProps {
  item: JoinedItems;
}

const ItemDetailsHeaderInfoView = memo(function ItemDetailsHeaderInfoView({
  item,
}: ItemDetailsHeaderInfoViewProps) {
  const { styles } = useStyles(stylesheet);

  const isOnSaleNow = isItemOnSaleNow(item);

  console.log('isOnSaleNow', isOnSaleNow);
  return (
    <View style={styles.container}>
      <Text type="subtitle" numberOfLines={2} style={styles.title}>
        {/* {item.itemName} */}
      </Text>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingVertical: theme.spacing.lg,
  },
  title: {
    lineHeight: theme.fontSize.md * 1.2,
  },
}));

export default ItemDetailsHeaderInfoView;
