import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { CurrentDiscounts } from '@/hooks/useDiscountListQuery';

import Card from '../../../ui/card';
import ProductCardThumbnailImage from '../../image/list-item-card-thumbnail';
import ListItemCardDetailView from '../../view/list-item-card/detail';

export interface ListItemCardProps {
  discount: Awaited<CurrentDiscounts>[number];
  numColumns?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

function ListItemCard({ discount, numColumns = 1, containerStyle }: ListItemCardProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Card style={[styles.cardContainer(numColumns > 1), containerStyle]}>
      <View style={styles.itemContainer(numColumns === 1)}>
        <ProductCardThumbnailImage
          product={discount.items!}
          width={115}
          height={115}
          style={styles.thumbnail}
        />
        <ListItemCardDetailView discount={discount} />
      </View>
    </Card>
  );
}

const stylesheet = createStyleSheet(theme => ({
  cardContainer: (needMargin: boolean) => ({
    marginHorizontal: needMargin ? theme.spacing.sm : 0,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: theme.spacing.sm / 2,
      height: theme.spacing.sm / 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
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

export default ListItemCard;
