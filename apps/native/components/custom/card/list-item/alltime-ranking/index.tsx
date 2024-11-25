import { AlltimeRankingResultItem } from '@cococom/supabase/types';
import { Href, Link } from 'expo-router';
import React, { memo } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/core/card';
import AlltimeRankingListItemCardDetailView from '@/components/custom/view/list-item-card/alltime-ranking/&detail';
import { ShadowPresets } from '@/libs/shadow';
import ListItemCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';

export interface AlltimeRankingListItemCardProps {
  item: AlltimeRankingResultItem;
  containerStyle?: StyleProp<ViewStyle>;
}

const AlltimeRankingListItemCard = memo(function AlltimeRankingListItemCard({
  item,
  containerStyle,
}: AlltimeRankingListItemCardProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Link href={`/(ranking)/item?itemId=${item.id}` as Href} asChild>
      <Pressable>
        <Card style={[styles.cardContainer(item.isOnSaleNow, item.is_online), containerStyle]}>
          <View style={styles.itemContainer}>
            <ListItemCardThumbnailImage
              product={item}
              width={120}
              height={120}
              style={styles.thumbnail}
              isOnline={item.is_online}
            />
            <AlltimeRankingListItemCardDetailView item={item} />
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

export default AlltimeRankingListItemCard;
