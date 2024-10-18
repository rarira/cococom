import { JoinedItems } from '@cococom/supabase/types';
import { memo, useCallback } from 'react';
import { Share } from 'react-native';
import { useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/core/button/icon';

interface ItemShareButtonProps {
  item: JoinedItems;
  iconProps?: Partial<Pick<IconButtonProps['iconProps'], 'size' | 'color'>>;
}

const ItemShareButton = memo(function ItemShareButton({ item, iconProps }: ItemShareButtonProps) {
  const { theme } = useStyles();

  const handlePress = useCallback(async () => {
    if (item) {
      Share.share({ message: item.itemName!, url: 'cccom://item?itemId=' + item.id });
    }
  }, [item]);

  return (
    <IconButton
      iconProps={{
        font: { type: 'MaterialIcon', name: 'ios-share' },
        size: theme.fontSize.lg,
        color: theme.colors.typography,
        ...iconProps,
      }}
      onPress={handlePress}
    />
  );
});

export default ItemShareButton;
