import { AlltimeRankingResultItem } from '@cococom/supabase/types';
import { QueryKey } from '@tanstack/react-query';
import { Href, Link } from 'expo-router';
import React, { memo } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/core/card';
import ProductCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';
import AlltimeRankingListItemCardDetailView from '@/components/custom/view/list-item-card/alltime-ranking/&detail';
import { shadowPresets } from '@/libs/shadow';

export interface AlltimeRankingListItemCardProps {
  item: AlltimeRankingResultItem;
  containerStyle?: StyleProp<ViewStyle>;
  queryKey: QueryKey;
}

const AlltimeRankingListItemCard = memo(function AlltimeRankingListItemCard({
  item,
  containerStyle,
  queryKey,
}: AlltimeRankingListItemCardProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Link href={`/(ranking)/item?itemId=${item.id}` as Href<string>} asChild>
      <Pressable>
        <Shadow
          {...shadowPresets.card(theme)}
          {...(item.isOnSaleNow && { startColor: `${theme.colors.tint}44` })}
          stretch
        >
          <Card style={[styles.cardContainer(item.isOnSaleNow), containerStyle]}>
            <View style={styles.itemContainer}>
              <ProductCardThumbnailImage
                product={item}
                width={120}
                height={120}
                style={styles.thumbnail}
                isOnline={item.is_online}
              />
              <AlltimeRankingListItemCardDetailView item={item} queryKey={queryKey} />
            </View>
          </Card>
        </Shadow>
      </Pressable>
    </Link>
  );
});

const stylesheet = createStyleSheet(theme => ({
  cardContainer: (onSale: boolean) => ({
    borderRadius: theme.borderRadius.lg,
    ...(onSale && { borderColor: `${theme.colors.tint}77`, borderWidth: 1 }),
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
