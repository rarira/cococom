import { JoinedItems } from '@cococom/supabase/types';
import { QueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import ItemShareButton from '@/components/custom/button/item-share';
import ListItemWishlistIconButton from '@/components/custom/button/list-item-wishlist-icon';
import OpenWebButton from '@/components/custom/button/open-web';
import { PortalHostNames } from '@/constants';
import { handleMutateOfItems, queryKeys } from '@/libs/react-query';
import Util from '@/libs/util';
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

  const queryKey = queryKeys.items.byId(+itemId, user?.id);

  const isOnline = item?.is_online;

  const handleMutate = useCallback(
    (queryClient: QueryClient) => async () => {
      return await handleMutateOfItems({ queryClient, queryKey });
    },
    [queryKey],
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
        {item.online_url ? (
          <View style={styles.buttonBackground(true)}>
            <OpenWebButton item={item} />
          </View>
        ) : null}
        <View style={styles.buttonBackground()}>
          <ItemShareButton item={item} />
        </View>
        <View style={styles.buttonBackground()}>
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
      <View style={styles.itemIdOverlay(isOnline)}>
        <Text style={styles.itemIdText(isOnline)}>
          {(isOnline ? '온라인, ' : '') + Util.extractItemid(item.itemId)}
        </Text>
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
  buttonBackground: (hasOnlineUrl?: boolean) => ({
    backgroundColor: `${hasOnlineUrl ? theme.colors.tint3 : theme.colors.background}88`,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: hasOnlineUrl ? 1 : 0,
    borderColor: theme.colors.tint3,
  }),
  itemIdOverlay: (isOnline: boolean) => ({
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    backgroundColor: `${isOnline ? theme.colors.tint3 : theme.colors.background}88`,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  }),
  itemIdText: (isOnline: boolean) => ({
    color: isOnline ? 'white' : theme.colors.typography,
    fontSize: theme.fontSize.sm,
    fontWeight: 'semibold',
  }),
}));

export default ItemDetailsPagerImagePageView;
