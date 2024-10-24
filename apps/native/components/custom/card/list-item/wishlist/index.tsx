import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { Href, Link } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton from '@/components/core/button/icon';
import Card from '@/components/core/card';
import ProductCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';
import WishlistItemCardDetailView from '@/components/custom/view/list-item-card/wishlist/&detail';
import { DiscountChannels } from '@/constants';
import { WishlistToRender } from '@/hooks/wishlist/useWishlists';
import { handleMutateOfWishlist } from '@/libs/react-query';
import { shadowPresets } from '@/libs/shadow';
import { WISHLIST_SORT_OPTIONS } from '@/libs/sort';
import { supabase } from '@/libs/supabase';
import { useListQueryKeyStore } from '@/store/list-query-key';

interface WishlistItemCardProps {
  item: WishlistToRender[number];
  containerStyle?: StyleProp<ViewStyle>;
  sortOption: keyof typeof WISHLIST_SORT_OPTIONS;
  queryKey: QueryKey;
  channelOption: DiscountChannels;
  options: string[];
}

const ACTION_BUTTON_WIDTH = 50;

const RightAction = memo(({ dragX, queryKey, wishlistId, itemId, pageIndexOfItem }: any) => {
  const { theme, styles } = useStyles(stylesheet);

  const queryClient = useQueryClient();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: dragX.value + ACTION_BUTTON_WIDTH,
        },
      ],
    };
  });

  const deleteWishlistMutation = useMutation({
    mutationFn: () => supabase.deleteWishlistById(wishlistId),
    onMutate: () => {
      return handleMutateOfWishlist({
        queryClient,
        queryKey,
        newWishlist: { itemId },
        pageIndexOfItem,
      });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });

  const handlePress = useCallback(async () => {
    try {
      await deleteWishlistMutation.mutateAsync();
    } catch (e) {
      console.error(e);
    }
  }, [deleteWishlistMutation]);

  return (
    <Animated.View style={[styles.actionButtonContainer, animatedStyle]}>
      <IconButton
        onPress={handlePress}
        iconProps={{
          font: { type: 'FontAwesomeIcon', name: 'trash-o' },
          size: theme.fontSize.lg,
          color: 'white',
        }}
        style={styles.actionButton(theme.colors.alert)}
      />
    </Animated.View>
  );
});

RightAction.displayName = 'RightAction';

const WishlistItemCard = memo(function WishlistItemCard({
  item,
  containerStyle,
  queryKey,
  channelOption,
  sortOption,
  options,
}: WishlistItemCardProps) {
  const { styles, theme } = useStyles(stylesheet);
  const queryClient = useQueryClient();

  const [setQueryKeyOfList, setPageIndexOfInfinteList] = useListQueryKeyStore(state => [
    state.setQueryKeyOfList,
    state.setPageIndexOfInfinteList,
  ]);

  const handlePress = useCallback(() => {
    setQueryKeyOfList(queryKey);
    setPageIndexOfInfinteList(item.pageIndex);
  }, [item.pageIndex, queryKey, setPageIndexOfInfinteList, setQueryKeyOfList]);

  const deleteWishlistMutation = useMutation({
    mutationFn: () => supabase.deleteWishlistById(item.wishlistId),
    onMutate: () => {
      return handleMutateOfWishlist({
        queryClient,
        queryKey,
        newWishlist: { itemId: item.id },
        pageIndexOfItem: item.pageIndex,
      });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });

  const handleLongPress = useCallback(async () => {
    try {
      console.log('deleteWishlistMutation.mutateAsync()');
      await deleteWishlistMutation.mutateAsync();
    } catch (e) {
      console.error(e);
    }
  }, [deleteWishlistMutation]);

  return (
    <Link
      href={`/(my)/item?itemId=${item.id}` as Href<string>}
      asChild
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <Pressable>
        <Shadow
          {...shadowPresets.card(theme)}
          {...(item.isOnSaleNow && { startColor: `${theme.colors.tint}44` })}
          stretch
          style={styles.container}
        >
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
              <WishlistItemCardDetailView
                item={item}
                channelOption={channelOption}
                options={options}
                sortOption={sortOption}
              />
            </View>
          </Card>
        </Shadow>
      </Pressable>
    </Link>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    backgroundColor: theme.colors.cardBackground,
  },
  cardContainer: (onSale: boolean, isOnline: boolean) => ({
    borderRadius: theme.borderRadius.lg,
    ...(onSale && { borderColor: `${theme.colors.tint}77`, borderWidth: 1 }),
    backgroundColor: isOnline ? `${theme.colors.tint3}11` : theme.colors.cardBackground,
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
  actionButtonContainer: {
    flexDirection: 'row',
    marginLeft: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
    width: ACTION_BUTTON_WIDTH,
  },
  actionButton: (backgroundColor: string) => ({
    backgroundColor,
    width: ACTION_BUTTON_WIDTH,
    height: '100%',
    borderRadius: 0,
  }),
}));

export default WishlistItemCard;
