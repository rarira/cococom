import { InsertWishlist } from '@cococom/supabase/libs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ListItemCardProps } from '@/components/custom/card/list-item';
import IconButton from '@/components/ui/button/icon';
import { PortalHostNames } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

import NeedAuthDialog from '../../dialog/need-auth';

interface ListItemWishlistIconButtonProps extends Pick<ListItemCardProps, 'discount'> {}

function ListItemWishlistIconButton({ discount }: ListItemWishlistIconButtonProps) {
  const { styles, theme } = useStyles(stylesheet);
  const [needAuthDialogVisible, setNeedAuthDialogVisible] = useState(false);
  const { user } = useUserStore();
  const queryClient = useQueryClient();

  const idToBeWishlistedRef = useRef<number | null>(null);

  const wishlistMutation = useMutation({
    mutationFn: (newWishlist: InsertWishlist) => {
      if (discount.isWishlistedByUser) {
        return supabase.deleteWishlist(newWishlist);
      }
      return supabase.createWishlist(newWishlist);
    },
    onMutate: async newWishlist => {
      const queryKey = queryKeys.discounts.currentList(user?.id);
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey) as unknown as (typeof discount)[];
      const discountIndex = previousData?.findIndex((d: any) => d.items.id === newWishlist.itemId);
      queryClient.setQueryData(queryKey, (old: any) => {
        if (discountIndex === -1) return old;
        const updatedDiscount = {
          ...old[discountIndex],
          totalWishlistCount: discount.isWishlistedByUser
            ? discount.totalWishlistCount - 1
            : discount.totalWishlistCount + 1,
          isWishlistedByUser: !discount.isWishlistedByUser,
        };
        console.log({ updatedDiscount });
        return [...old.slice(0, discountIndex), updatedDiscount, ...old.slice(discountIndex + 1)];
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKeys.discounts.currentList(user?.id), context?.previousData);
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
    return {
      name: discount.isWishlistedByUser ? 'star' : ('star-border' as any),
      color: discount.isWishlistedByUser ? theme.colors.alert : theme.colors.typography,
    };
  }, [discount.isWishlistedByUser, theme.colors.alert, theme.colors.typography]);

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
