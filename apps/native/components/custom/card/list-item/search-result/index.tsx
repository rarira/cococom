import { Link } from 'expo-router';
import React, { memo } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ProductCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';
import SearchResultListItemCardDetailView from '@/components/custom/view/list-item-card/search-result/&detail';
import Card from '@/components/ui/card';
import { SearchQueryParams, SearchResultToRender } from '@/libs/search';
import { shadowPresets } from '@/libs/shadow';
import { ITEM_SORT_OPTIONS } from '@/libs/sort';

interface SearchResultListItemCardProps extends SearchQueryParams {
  item: SearchResultToRender[number];
  containerStyle?: StyleProp<ViewStyle>;
  sortOption: keyof typeof ITEM_SORT_OPTIONS;
}

const SearchResultListItemCard = memo(function SearchResultListItemCard({
  item,
  containerStyle,
  ...restProps
}: SearchResultListItemCardProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Link
      href={{
        pathname: '(search)/details/[itemId]',
        params: {
          itemId: item.id,
        },
      }}
      asChild
    >
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
              />
              <SearchResultListItemCardDetailView item={item} {...restProps} />
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

export default SearchResultListItemCard;
