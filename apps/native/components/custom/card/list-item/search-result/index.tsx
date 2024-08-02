import React, { memo } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ProductCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';
import SearchResultListItemCardDetailView from '@/components/custom/view/list-item-card/search-result/&detail';
import Card from '@/components/ui/card';
import { SearchQueryParams, SearchResultToRender } from '@/libs/search';
import { shadowPresets } from '@/libs/shadow';

interface SearchResultListItemCardProps extends SearchQueryParams {
  item: SearchResultToRender[number];
  containerStyle?: StyleProp<ViewStyle>;
}

const SearchResultListItemCard = memo(function SearchResultListItemCard({
  item,
  containerStyle,
  ...restProps
}: SearchResultListItemCardProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Shadow {...shadowPresets.card(theme)} style={styles.shadowContainer}>
      <Pressable onPress={() => console.log('Pressed')}>
        <Card style={[styles.cardContainer, containerStyle]}>
          <View style={styles.itemContainer}>
            <ProductCardThumbnailImage
              product={item}
              width={115}
              height={115}
              style={styles.thumbnail}
            />
            <SearchResultListItemCardDetailView item={item} {...restProps} />
          </View>
        </Card>
      </Pressable>
    </Shadow>
  );
});

const stylesheet = createStyleSheet(theme => ({
  cardContainer: {
    borderRadius: theme.borderRadius.md,
  },
  shadowContainer: { flex: 1, width: '100%' },
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
