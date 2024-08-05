import { Href, Link } from 'expo-router';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { CurrentDiscounts } from '@/hooks/useDiscountListQuery';
import { shadowPresets } from '@/libs/shadow';

import Card from '../../../../ui/card';
import ProductCardThumbnailImage from '../../../image/list-item-card-thumbnail';
import DiscountListItemCardDetailView from '../../../view/list-item-card/discount/&detail';

export interface DiscountListItemCardProps {
  discount: Awaited<CurrentDiscounts>[number];
  numColumns?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

function DiscountListItemCard({
  discount,
  numColumns = 1,
  containerStyle,
}: DiscountListItemCardProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Link href={`/(home)/item?itemId=${discount.items.id}` as Href<string>} asChild>
      <Pressable>
        <Shadow {...shadowPresets.card(theme)} stretch>
          <Card style={[styles.cardContainer(numColumns > 1), containerStyle]}>
            <View style={styles.itemContainer(numColumns === 1)}>
              <ProductCardThumbnailImage
                product={discount.items!}
                width={115}
                height={115}
                style={styles.thumbnail}
              />
              <DiscountListItemCardDetailView discount={discount} />
            </View>
          </Card>
        </Shadow>
      </Pressable>
    </Link>
  );
}

const stylesheet = createStyleSheet(theme => ({
  cardContainer: (needMargin: boolean) => ({
    marginHorizontal: needMargin ? theme.spacing.sm : 0,
    borderRadius: theme.borderRadius.md,
  }),
  itemContainer: (row: boolean) => ({
    flex: 1,
    flexDirection: row ? 'row' : 'column',
    justifyContent: row ? 'space-between' : 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.md,
  }),
  thumbnail: {
    borderRadius: theme.borderRadius.md,
  },
}));

export default DiscountListItemCard;
