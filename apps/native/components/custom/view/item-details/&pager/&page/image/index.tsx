import { JoinedItems } from '@cococom/supabase/types';
import { QueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ItemShareButton from '@/components/custom/button/item-share';
import ListItemWishlistIconButton from '@/components/custom/button/list-item-wishlist-icon';
import Text from '@/components/ui/text';
import { PortalHostNames } from '@/constants';
import {
  handleMutateOfAlltimeRanking,
  handleMutateOfDiscountCurrentList,
  handleMutateOfItems,
  handleMutateOfSearchResult,
  queryKeys,
} from '@/libs/react-query';
import { useListQueryKeyStore } from '@/store/list-query-key';
import { useUserStore } from '@/store/user';

interface ItemDetailsPagerImagePageViewProps {
  item: JoinedItems;
}

const ItemDetailsPagerImagePageView = memo(function ItemDetailsPagerImagePageView({
  item,
}: ItemDetailsPagerImagePageViewProps) {
  const { styles, theme } = useStyles(stylesheet);
  const { itemId } = useLocalSearchParams();

  const user = useUserStore(store => store.user);

  const [queryKeyOfList, pageIndexOfInfinteList] = useListQueryKeyStore(state => [
    state.queryKeyOfList,
    state.pageIndexOfInfinteList,
  ]);

  const queryKey = queryKeys.items.byId(+itemId, user?.id);

  const handleMutate = useCallback(
    (queryClient: QueryClient) => async () => {
      if (queryKeyOfList?.[0] === 'discounts') {
        handleMutateOfDiscountCurrentList({
          queryClient,
          queryKey: queryKeyOfList,
          newWishlist: { itemId: item.id, userId: user?.id ?? '' },
        });
      }
      if (queryKeyOfList?.[0] === 'search') {
        handleMutateOfSearchResult({
          queryClient,
          queryKey: queryKeyOfList,
          newWishlist: { itemId: item.id, userId: user?.id ?? '' },
          pageIndexOfItem: pageIndexOfInfinteList!,
        });
      }
      if (queryKeyOfList?.[0] === 'alltimeRankings') {
        handleMutateOfAlltimeRanking({
          queryClient,
          queryKey: queryKeyOfList,
          newWishlist: { itemId: item.id, userId: user?.id ?? '' },
        });
      }
      return await handleMutateOfItems({ queryClient, queryKey });
    },
    [item.id, pageIndexOfInfinteList, queryKey, queryKeyOfList, user?.id],
  );

  return (
    <View style={styles.page} key="1" collapsable={false}>
      <Image source={`https://picsum.photos/500/500`} style={styles.image} />
      <View style={styles.nameOverlay}>
        <Text style={styles.nameText} numberOfLines={2}>
          {item.itemName}
        </Text>
      </View>
      <View style={styles.buttonOverlay}>
        <View style={styles.buttonBackground}>
          <ItemShareButton item={item} />
        </View>
        <View style={styles.buttonBackground}>
          <ListItemWishlistIconButton<JoinedItems>
            item={item}
            // noText
            iconProps={{ size: theme.fontSize.lg }}
            portalHostName={PortalHostNames.ITEM_DETAILS}
            queryKey={queryKey}
            onMutate={handleMutate}
          />
        </View>
      </View>
      <View style={styles.itemIdOverlay}>
        <Text style={styles.itemIdText}>{item.itemId}</Text>
      </View>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  page: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
    objectFit: 'cover',
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${theme.colors.background}88`,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  nameText: {
    color: theme.colors.typography,
    fontWeight: 'bold',
    fontSize: theme.fontSize.md,
  },
  buttonOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    top: theme.spacing.md,
    right: theme.spacing.md,
    gap: theme.spacing.md,
  },
  buttonBackground: {
    backgroundColor: `${theme.colors.background}88`,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  itemIdOverlay: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    backgroundColor: `${theme.colors.background}88`,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  itemIdText: {
    color: theme.colors.typography,
    fontSize: theme.fontSize.sm,
    fontWeight: 'semibold',
  },
}));

export default ItemDetailsPagerImagePageView;
