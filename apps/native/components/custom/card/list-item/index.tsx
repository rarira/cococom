import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { CurrentDiscounts } from '@/app/(tabs)';

import Card from '../../../ui/card';
import ProductCardThumbnailImage from '../../list-item-card-thumbnail';
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
          width={110}
          height={110}
          // style={styles.thumbnail}
        />
        <ListItemCardDetailView discount={discount} />
      </View>
    </Card>
  );
}

const stylesheet = createStyleSheet(theme => ({
  cardContainer: (needMargin: boolean) => ({
    marginHorizontal: needMargin ? theme.spacing.sm : 0,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
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
}));

export default ListItemCard;
