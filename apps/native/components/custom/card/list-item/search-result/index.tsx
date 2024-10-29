import { Href, Link } from 'expo-router';
import React, { memo } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/core/card';
import ProductCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';
import SearchResultListItemCardDetailView from '@/components/custom/view/list-item-card/search-result/&detail';
import { SearchResultToRender } from '@/libs/search';
import { ShadowPresets } from '@/libs/shadow';

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
    <Link href={`/(search)/item?itemId=${item.id}` as Href<string>} asChild>
      <Pressable>
        <Card style={[styles.cardContainer(item.isOnSaleNow, item.is_online), containerStyle]}>
          <View style={styles.itemContainer}>
            <ProductCardThumbnailImage
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
    backgroundColor: isOnline ? `${theme.colors.tint3}11` : theme.colors.cardBackground,
    ...ShadowPresets.card(theme),
    ...(onSale && {
      borderColor: `${theme.colors.tint}77`,
      borderWidth: 1,
      shadowColor: `${theme.colors.tint}44`,
      shadowOpacity: 1,
    }),
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
