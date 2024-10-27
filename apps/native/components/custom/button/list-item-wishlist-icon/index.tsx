import { InsertWishlist } from '@cococom/supabase/libs';
import { JoinedItems } from '@cococom/supabase/types';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/core/button/icon';
import { ITEM_DETAILS_MAX_COUNT, PortalHostNames } from '@/constants';
import { InfiniteSearchResultData } from '@/libs/search';
import { supabase } from '@/libs/supabase';
import Util from '@/libs/util';
import { updateWishlistInCache } from '@/libs/wishlist';
import { useUserStore } from '@/store/user';

import NeedAuthDialog from '../../dialog/need-auth';

interface ListItemWishlistIconButtonProps<
  T extends Pick<JoinedItems, 'id' | 'totalWishlistCount' | 'isWishlistedByUser'>,
> {
  item: T;
  portalHostName: PortalHostNames;
  onMutate?: (queryClient: QueryClient) => (newWishlist: InsertWishlist) => Promise<{
    previousData: T | T[] | InfiniteSearchResultData;
  }>;
  noText?: boolean;
  iconProps?: Partial<Pick<IconButtonProps['iconProps'], 'size' | 'color'>>;
  style?: IconButtonProps['style'];
}

function ListItemWishlistIconButton<
  T extends Pick<JoinedItems, 'id' | 'totalWishlistCount' | 'isWishlistedByUser'>,
>({
  item,
  portalHostName,
  onMutate,
  noText,
  iconProps,
  style,
}: ListItemWishlistIconButtonProps<T>) {
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
    onMutate: onMutate?.(queryClient),
    onSuccess: () => {
      updateWishlistInCache({ itemId: item.id, queryClient });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });

  const iconPropsToPass = useMemo(() => {
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
  }, [item, setCallbackAfterSignIn, user, wishlistMutation]);

  return (
    <>
      <IconButton
        {...(!noText && {
          text: Util.showMaxNumber(item.totalWishlistCount, ITEM_DETAILS_MAX_COUNT),
          textStyle: styles.text,
        })}
        iconProps={{
          font: { type: 'MaterialIcon', name: iconPropsToPass.name },
          color: iconPropsToPass.color,
          ...iconProps,
        }}
        onPress={handlePress}
        style={style}
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
