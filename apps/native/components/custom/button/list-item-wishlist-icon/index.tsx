import { InsertWishlist } from '@cococom/supabase/libs';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ListItemCardProps } from '@/components/custom/card/list-item';
import IconButton from '@/components/ui/button/icon';
import { PortalHostNames } from '@/constants';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

import NeedAuthDialog from '../../dialog/need-auth';

interface ListItemWishlistIconButtonProps extends Pick<ListItemCardProps, 'discount'> {}

function ListItemWishlistIconButton({ discount }: ListItemWishlistIconButtonProps) {
  const { styles, theme } = useStyles(stylesheet);
  const [needAuthDialogVisible, setNeedAuthDialogVisible] = useState(false);
  const { user } = useUserStore();

  const isWishlistedByUser = !!discount.userWishlistCount;

  const idToBeWishlistedRef = useRef<number | null>(null);

  console.log(discount.items.itemName, { isWishlistedByUser });
  const wishlistMutation = useMutation({
    mutationFn: (newWishlist: InsertWishlist) => {
      if (isWishlistedByUser) {
        return supabase.deleteWishlist(newWishlist);
      }
      return supabase.createWishlist(newWishlist);
    },
  });

  useLayoutEffect(() => {
    if (user && needAuthDialogVisible) {
      setNeedAuthDialogVisible(false);
      if (idToBeWishlistedRef.current) {
        wishlistMutation.mutate({
          itemId: idToBeWishlistedRef.current,
          userId: user.id,
        });
      }
    }
  }, [needAuthDialogVisible, user, wishlistMutation]);

  const iconProps = useMemo(() => {
    const isWishlistedByUser = !!discount.userWishlistCount;
    return {
      name: isWishlistedByUser ? 'star' : ('star-border' as any),
      color: isWishlistedByUser ? theme.colors.alert : theme.colors.typography,
    };
  }, [discount.userWishlistCount, theme]);

  const handlePress = useCallback(() => {
    if (!user) {
      idToBeWishlistedRef.current = discount.items.id;
      setNeedAuthDialogVisible(true);
      return;
    }
    wishlistMutation.mutate({
      itemId: discount.items.id,
      userId: user.id,
    });
  }, [discount.items.id, user, wishlistMutation]);

  return (
    <>
      <IconButton
        text={discount.totalWishlistCount.toString()}
        textStyle={styles.text}
        iconProps={iconProps}
        onPress={handlePress}
      />
      {needAuthDialogVisible && (
        <NeedAuthDialog
          portalHostName={PortalHostNames.HOME}
          visible={needAuthDialogVisible}
          setVisible={setNeedAuthDialogVisible}
          body="관심 상품 등록을 하시면 편리하게 쇼핑하실 수 있습니다. 로그인이 필요합니다"
        />
      )}
    </>
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
