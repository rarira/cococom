import { useMemo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ListItemCardProps } from '@/components/custom/card/list-item';
import IconButton from '@/components/ui/button/icon';

interface ListItemWishlistIconButtonProps extends Pick<ListItemCardProps, 'discount'> {}

function ListItemWishlistIconButton({ discount }: ListItemWishlistIconButtonProps) {
  const { styles, theme } = useStyles(stylesheet);

  const iconProps = useMemo(() => {
    const isWishlistedByUser = !!discount.userWishlistCount;
    return {
      name: isWishlistedByUser ? 'star' : ('star-border' as any),
      color: isWishlistedByUser ? theme.colors.alert : undefined,
    };
  }, [discount.userWishlistCount, theme]);

  return (
    <IconButton
      text={discount.totalWishlistCount.toString()}
      textStyle={styles.text}
      iconProps={iconProps}
      onPress={() => console.log('Wishlist button pressed')}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  text: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm,
    opacity: 0.8,
  },
}));

export default ListItemWishlistIconButton;
