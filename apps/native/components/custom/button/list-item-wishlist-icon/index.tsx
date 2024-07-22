import { CategorySectors, InsertWishlist } from '@cococom/supabase/libs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ListItemCardProps } from '@/components/custom/card/list-item';
import IconButton from '@/components/ui/button/icon';
import { PortalHostNames } from '@/constants';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

import NeedAuthDialog from '../../dialog/need-auth';

interface ListItemWishlistIconButtonProps {
  item: ListItemCardProps['discount']['items'];
}

function ListItemWishlistIconButton({ item }: ListItemWishlistIconButtonProps) {
  const { styles, theme } = useStyles(stylesheet);
  const [needAuthDialogVisible, setNeedAuthDialogVisible] = useState(false);
  const { user, setCallbackAfterSignIn } = useUserStore();

  const queryClient = useQueryClient();

  const { categorySector: categorySectorParam } = useLocalSearchParams<{
    categorySector: CategorySectors;
  }>();

  // const idToBeWishlistedRef = useRef<number | null>(null);

  const queryKey = queryKeys.discounts.currentList(user?.id, categorySectorParam);
  const wishlistMutation = useMutation({
    mutationFn: (newWishlist: InsertWishlist) => {
      if (item.isWishlistedByUser) {
        return supabase.deleteWishlist(newWishlist);
      }
      return supabase.createWishlist(newWishlist);
    },
    onMutate: async newWishlist => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(
        queryKey,
      ) as unknown as ListItemCardProps['discount'][];

      const discountIndex = previousData?.findIndex((d: any) => d.items.id === newWishlist.itemId);
      queryClient.setQueryData(queryKey, (old: any) => {
        if (discountIndex === -1) return old;
        const updatedDiscount = {
          ...old[discountIndex],
          items: {
            ...old[discountIndex].items,
            totalWishlistCount: item.isWishlistedByUser
              ? item.totalWishlistCount - 1
              : item.totalWishlistCount + 1,
            isWishlistedByUser: !item.isWishlistedByUser,
          },
        };

        return [...old.slice(0, discountIndex), updatedDiscount, ...old.slice(discountIndex + 1)];
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });

  const iconProps = useMemo(() => {
    return {
      name: item.isWishlistedByUser ? 'star' : ('star-border' as any),
      color: item.isWishlistedByUser ? theme.colors.alert : theme.colors.typography,
    };
  }, [item.isWishlistedByUser, theme.colors.alert, theme.colors.typography]);

  const handlePress = useCallback(() => {
    if (!user) {
      setCallbackAfterSignIn(user => {
        wishlistMutation.mutate({
          itemId: item.id,
          userId: user.id,
        });
        setNeedAuthDialogVisible(false);
      });
      setNeedAuthDialogVisible(true);
      return;
    }
    wishlistMutation.mutate({
      itemId: item.id,
      userId: user.id,
    });
  }, [item.id, setCallbackAfterSignIn, user, wishlistMutation]);

  return (
    <>
      <IconButton
        text={item.totalWishlistCount.toString()}
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
