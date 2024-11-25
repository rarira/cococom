import { Href, Link } from 'expo-router';
import React, { memo } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/core/card';
import SearchResultListItemCardDetailView from '@/components/custom/view/list-item-card/search-result/&detail';
import { SearchResultToRender } from '@/libs/search';
import { ShadowPresets } from '@/libs/shadow';
import ListItemCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';

interface SearchResultListItemCardProps {
  item: SearchResultToRender[number];
  containerStyle?: StyleProp<ViewStyle>;
}

const SearchResultListItemCard = memo(function SearchResultListItemCard({
  item,
  containerStyle,
}: SearchResultListItemCardProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Link href={`/(search)/item?itemId=${item.id}` as Href} asChild>
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
            <SearchResultListItemCardDetailView item={item} />
          </View>
        </Card>
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

export default SearchResultListItemCard;
