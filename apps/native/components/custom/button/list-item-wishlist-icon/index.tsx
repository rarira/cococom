import { InsertWishlist } from '@cococom/supabase/libs';
import { JoinedItems } from '@cococom/supabase/types';
import { QueryClient, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton from '@/components/ui/button/icon';
import { PortalHostNames } from '@/constants';
import { supabase } from '@/libs/supabase';
import { useUserStore } from '@/store/user';

import NeedAuthDialog from '../../dialog/need-auth';

interface ListItemWishlistIconButtonProps<
  T extends Pick<JoinedItems, 'id' | 'totalWishlistCount' | 'isWishlistedByUser'>,
> {
  item: T;
  portalHostName: PortalHostNames;
  queryKey: QueryKey;
  onMutate?: (
    queryClient: QueryClient,
  ) => (
    newWishlist: InsertWishlist,
  ) => Promise<{ previousData: T[] | { pages: T[]; [key: string]: unknown } }>;
}

function ListItemWishlistIconButton<
  T extends Pick<JoinedItems, 'id' | 'totalWishlistCount' | 'isWishlistedByUser'>,
>({ item, portalHostName, queryKey, onMutate }: ListItemWishlistIconButtonProps<T>) {
  const { styles, theme } = useStyles(stylesheet);
  const [needAuthDialogVisible, setNeedAuthDialogVisible] = useState(false);
  const { user, setCallbackAfterSignIn } = useUserStore();

  const queryClient = useQueryClient();

  const wishlistMutation = useMutation({
    mutationFn: (newWishlist: InsertWishlist) => {
      if (item.isWishlistedByUser) {
        return supabase.deleteWishlist(newWishlist);
      }
      return supabase.createWishlist(newWishlist);
    },
    onMutate: onMutate ? onMutate(queryClient) : undefined,
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
        requestAnimationFrame(() => {
          wishlistMutation.mutate({
            itemId: item.id,
            userId: user.id,
          });
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
        iconProps={{ font: { type: 'MaterialIcon', name: iconProps.name }, color: iconProps.color }}
        onPress={handlePress}
      />
      {needAuthDialogVisible && (
        <NeedAuthDialog
          portalHostName={portalHostName}
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
