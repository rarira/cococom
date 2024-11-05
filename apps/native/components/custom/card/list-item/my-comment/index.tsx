import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { Href, Link } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/core/card';
import ProductCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';
import MyCommentListItemCardDetailView from '@/components/custom/view/list-item-card/wishlist/&detail';
import { MyCommentToRender } from '@/hooks/comment/useMyComments';
import { handleMutateOfWishlist } from '@/libs/react-query';
import { ShadowPresets } from '@/libs/shadow';
import { supabase } from '@/libs/supabase';

interface MyCommentListItemCardProps {
  item: MyCommentToRender[number];
  containerStyle?: StyleProp<ViewStyle>;
  queryKey: QueryKey;
  onMutate: () => void;
}

const MyCommentListItemCard = memo(function MyCommentListItemCard({
  item,
  containerStyle,
  queryKey,
  onMutate,
}: MyCommentListItemCardProps) {
  const { styles } = useStyles(stylesheet);
  const queryClient = useQueryClient();

  const deleteWishlistMutation = useMutation({
    mutationFn: () => supabase.comments.deleteComment(item.id),
    onMutate: () => {
      return;
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSuccess: () => {
      handleMutateOfWishlist({
        queryClient,
        queryKey,
        newWishlist: { itemId: item.id },
        pageIndexOfItem: item.pageIndex,
        callback: onMutate,
      });
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
    <Link
      href={`/(my)/item?itemId=${item.id}` as Href<string>}
      asChild
      onLongPress={handleLongPress}
    >
      <Pressable>
        <Card style={[styles.cardContainer(item.isOnSaleNow, item.is_online), containerStyle]}>
          <View style={styles.itemContainer}>
            <ProductCardThumbnailImage
              product={item}
              width={80}
              height={80}
              style={styles.thumbnail}
              isOnline={item.is_online}
              small
            />
            <MyCommentListItemCardDetailView item={item} />
          </View>
        </Card>
      </Pressable>
    </Link>
  );
});

const stylesheet = createStyleSheet(theme => ({
  cardContainer: (onSale: boolean, isOnline: boolean) => ({
    borderRadius: theme.borderRadius.lg,
    backgroundColor: isOnline ? `${theme.colors.tint3}11` : theme.colors.cardBackground,
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

export default MyCommentListItemCard;
