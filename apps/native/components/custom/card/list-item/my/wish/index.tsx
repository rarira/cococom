import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { Href, Link } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/core/card';
import WishlistItemCardDetailView from '@/components/custom/view/list-item-card/wishlist/&detail';
import { WishlistToRender } from '@/hooks/wishlist/useWishlists';
import { handleMutateOfWishlist } from '@/libs/react-query';
import { ShadowPresets } from '@/libs/shadow';
import { supabase } from '@/libs/supabase';
import ListItemCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';

interface MyWishlistItemCardProps {
  item: WishlistToRender[number];
  containerStyle?: StyleProp<ViewStyle>;
  queryKey: QueryKey;
  onMutate: () => void;
}

const MyWishlistItemCard = memo(function MyWishlistItemCard({
  item,
  containerStyle,
  queryKey,
  onMutate,
}: MyWishlistItemCardProps) {
  const { styles } = useStyles(stylesheet);
  const queryClient = useQueryClient();

  const deleteWishlistMutation = useMutation({
    mutationFn: () => supabase.wishlists.deleteWishlistById(item.wishlistId),
    onMutate: () => {
      return handleMutateOfWishlist({
        queryClient,
        queryKey,
        newWishlist: { itemId: item.id },
        pageIndexOfItem: item.pageIndex,
        callback: onMutate,
      });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });

  const handleLongPress = useCallback(async () => {
    try {
      await deleteWishlistMutation.mutateAsync();
    } catch (e) {
      console.error(e);
    }
  }, [deleteWishlistMutation]);

  return (
    <Link href={`/(my)/item?itemId=${item.id}` as Href} asChild onLongPress={handleLongPress}>
      <Pressable>
        <Card style={[styles.cardContainer(item.isOnSaleNow, item.is_online), containerStyle]}>
          <View style={styles.itemContainer}>
            <ListItemCardThumbnailImage
              product={item}
              width={80}
              height={80}
              style={styles.thumbnail}
              isOnline={item.is_online}
              small
            />
            <WishlistItemCardDetailView item={item} />
          </View>
        </Card>
      </Pressable>
    </Link>
  );
});

const stylesheet = createStyleSheet(theme => ({
  cardContainer: (onSale: boolean, isOnline: boolean) => ({
    borderRadius: theme.borderRadius.lg,
    backgroundColor: isOnline ? `${theme.colors.tint3}44` : theme.colors.cardBackground,
    ...(onSale && {
      borderColor: `${theme.colors.tint}77`,
      borderWidth: 1,
    }),
    ...ShadowPresets.card(theme, onSale ? `${theme.colors.tint}22` : undefined),
  }),
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  thumbnail: {
    borderRadius: theme.borderRadius.md,
  },
}));

export default MyWishlistItemCard;
